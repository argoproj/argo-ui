import * as classNames from 'classnames';
import * as moment from 'moment';
import * as React from 'react';

import * as models from '../../../../models';
import { Utils } from '../../../shared/components/utils';

require('./workflow-timeline.scss');

const ROUND_START_DIFF_MS = 1000;
const NODE_NAME_WIDTH = 250;

interface Props {
    workflow: models.Workflow;
    selectedNodeId: string;
    nodeClicked?: (node: models.NodeStatus) => any;
}

export class WorkflowTimeline extends React.Component<Props> {

    public render() {
        const nodes = Object.keys(this.props.workflow.status.nodes)
                .map((id) => this.props.workflow.status.nodes[id])
                .filter((node) => node.startedAt && node.type === 'Pod')
                .sort((first, second) => moment(first.startedAt).diff(second.startedAt));
        if (nodes.length === 0) {
            return <div/>;
        }
        const timelineStart = nodes[0].startedAt;
        const timeToLeft = (time: moment.Moment) => time.diff(timelineStart, 'seconds') * 10 + NODE_NAME_WIDTH;
        const groups = nodes.map((node) => ({
            startedAt: node.startedAt,
            finishedAt: moment(node.finishedAt) || moment(),
            nodes: [Object.assign({}, node, {
                left: timeToLeft(moment(node.startedAt)),
                width: timeToLeft(moment(node.finishedAt)) - timeToLeft(moment(node.startedAt)),
            })],
        }));
        for (let i = groups.length - 1; i > 1; i--) {
            const cur = groups[i];
            const next = groups[i - 1];
            if (moment(cur.startedAt).diff(next.finishedAt, 'milliseconds') < 0 && moment(next.startedAt).diff(cur.startedAt, 'milliseconds') < ROUND_START_DIFF_MS) {
                next.nodes = next.nodes.concat(cur.nodes);
                next.finishedAt = moment(nodes
                    .map((node) => node.finishedAt ? moment(node.finishedAt).valueOf() : moment().valueOf())
                    .reduce((first, second) => Math.max(first, second), next.finishedAt.valueOf()));
                groups.splice(i, 1);
            }
        }
        return (
            <div className='workflow-timeline'>
                <div style={{left: NODE_NAME_WIDTH}} className='workflow-timeline__start-line'/>
                <div className='workflow-timeline__row workflow-timeline__row--header'/>
                {groups.map((group) => [
                    (<div style={{left: timeToLeft(group.finishedAt)}} key={`group-${group.startedAt}`} className={classNames('workflow-timeline__start-line')}>
                        <span className='workflow-timeline__start-line__time'>{moment(group.finishedAt).format('hh:ss')}</span>
                    </div>),
                    ...group.nodes.map((node) => (
                        <div key={node.id}
                                className={classNames('workflow-timeline__row', { 'workflow-timeline__row--selected': node.id === this.props.selectedNodeId })}
                                onClick={() => this.props.nodeClicked && this.props.nodeClicked(node)}>
                            {Utils.shortNodeName(node)}
                            <div style={{left: node.left, width: node.width}} className={`workflow-timeline__node workflow-timeline__node--${node.phase.toLocaleLowerCase()}`}/>
                        </div>
                    )),
                ])}
            </div>
        );
    }
}
