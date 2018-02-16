import * as classNames from 'classnames';
import * as dagre from 'dagre';
import * as moment from 'moment';
import * as React from 'react';
import { Observable, Subscription } from 'rxjs';

import * as models from '../../../../models';
import { Utils } from '../../../shared/components';

interface Props {
    workflow: models.Workflow;
    selectedNodeId?: string;
    nodeClicked?: (node: models.NodeStatus) => any;
}

interface Line { x1: number; y1: number; x2: number; y2: number; noArrow: boolean; }

require('./workflow-dag.scss');

const NODE_WIDTH = 182;
const NODE_HEIGHT = 52;

export class WorkflowDag extends React.Component<Props, { renderTime: moment.Moment; }> {

    private refreshSubscription: Subscription;

    constructor(props: Props) {
        super(props);
        this.state = { renderTime: moment() };
        this.ensureRunningWorkflowRefreshing(this.props.workflow);
    }

    public componentWillReceiveProps(nextProps: Props) {
        this.ensureRunningWorkflowRefreshing(nextProps.workflow);
    }

    public componentWillUnmount() {
        if (this.refreshSubscription) {
            this.refreshSubscription.unsubscribe();
            this.refreshSubscription = null;
        }
    }

    public render() {
        const graph = new dagre.graphlib.Graph();
        graph.setGraph({});
        graph.setDefaultEdgeLabel(() => ({}));
        const nodes = this.props.workflow.status && this.props.workflow.status.nodes || {};
        Object.keys(nodes).forEach((nodeId) => {
            const node = nodes[nodeId];
            if (this.isVirtual(node)) {
                graph.setNode(nodeId, {width: 1, height: 1, ...nodes[nodeId]});
            } else {
                graph.setNode(nodeId, {width: NODE_WIDTH, height: NODE_HEIGHT, ...nodes[nodeId]});
            }
        });
        Object.keys(nodes).forEach((nodeId) => {
            const node = nodes[nodeId];
            (node.children || []).forEach((childId) => graph.setEdge(nodeId, childId));
        });
        dagre.layout(graph);
        const edges: {from: string, to: string, lines: Line[]}[] = [];
        graph.edges().forEach((edgeInfo) => {
            const edge = graph.edge(edgeInfo);
            const lines: Line[] = [];
            if (edge.points.length > 1) {
                for (let i = 1; i < edge.points.length; i++) {
                    const toNode = nodes[edgeInfo.w];
                    lines.push({ x1: edge.points[i - 1].x, y1: edge.points[i - 1].y, x2: edge.points[i].x, y2: edge.points[i].y, noArrow: this.isVirtual(toNode) });
                }
            }
            edges.push({ from: edgeInfo.v, to: edgeInfo.w, lines });
        });
        const size = this.getGraphSize(graph.nodes().map((id) => graph.node(id)));
        return (
            <div className='workflow-dag' style={{width: size.width + 10, height: size.height + 10}}>
                {graph.nodes().map((id) => {
                    const node = graph.node(id) as models.NodeStatus & dagre.Node;
                    const shortName = Utils.shortNodeName(node);
                    return (
                        <div key={id}
                                className={classNames('workflow-dag__node', {active: node.id === this.props.selectedNodeId, virtual: this.isVirtual(node)})}
                                style={{left: node.x, top: node.y, width: node.width, height: node.height}}
                                onClick={() => this.props.nodeClicked && this.props.nodeClicked(node)}>
                            <div className={`workflow-dag__node-status workflow-dag__node-status--${node.phase.toLocaleLowerCase()}`}/>
                            <div className='workflow-dag__node-title'>{shortName}</div>
                        </div>
                    );
                })}
                {edges.map((edge) => (
                    <div key={`${edge.from}-${edge.to}`} className='workflow-dag__edge'>
                    {edge.lines.map((line, i) => {
                        const distance = Math.sqrt(Math.pow(line.x1 - line.x2, 2) + Math.pow(line.y1 - line.y2, 2));
                        const xMid = (line.x1 + line.x2) / 2;
                        const yMid = (line.y1 + line.y2) / 2;
                        const angle = Math.atan2(line.y1 - line.y2, line.x1 - line.x2) * 180 / Math.PI;
                        return (
                            <div className={classNames('workflow-dag__line', {'workflow-dag__line--no-arrow': line.noArrow })} key={i}
                                style={{ width: distance, left: xMid - (distance / 2), top: yMid, transform: `translate(100px, 35px) rotate(${angle}deg)`}} />
                        );
                    })}</div>
                ))}
            </div>
        );
    }

    private isVirtual(node: models.NodeStatus) {
        return (node.type === 'StepGroup' || node.type === 'DAG') && !!node.boundaryID;
    }

    private getGraphSize(nodes: dagre.Node[]): { width: number, height: number} {
        let width = 0;
        let height = 0;
        nodes.forEach((node) => {
            width = Math.max(node.x + node.width, width);
            height = Math.max(node.y + node.height, height);
        });
        return {width, height};
    }

    private ensureRunningWorkflowRefreshing(workflow: models.Workflow) {
        const isCompleted = workflow.status && ([models.NODE_PHASE.ERROR, models.NODE_PHASE.SUCCEEDED, models.NODE_PHASE.SKIPPED].indexOf(workflow.status.phase) > -1);
        if (!this.refreshSubscription && !isCompleted) {
            this.refreshSubscription = Observable.interval(1000).subscribe(() => this.setState({renderTime: moment()}));
        } else if (this.refreshSubscription && isCompleted) {
            this.refreshSubscription.unsubscribe();
            this.refreshSubscription = null;
        }
    }
}
