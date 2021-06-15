import {faQuestionCircle} from '@fortawesome/free-regular-svg-icons';
import {faCheck, faCircleNotch, faClipboard, faExclamationCircle, faExclamationTriangle, faTimes} from '@fortawesome/free-solid-svg-icons';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import * as React from 'react';
import {Menu, ThemeDiv, Tooltip} from '..';

export interface Pod {
    objectMeta?: any;
    status?: string;
    icon?: string;
    ready?: string;
    restarts?: number;
}

export enum PodStatus {
    Pending = 'pending',
    Success = 'success',
    Failed = 'failure',
    Warning = 'warning',
    Unknown = 'unknown',
}

export const ParsePodStatus = (status: string): PodStatus => {
    switch (status) {
        case 'Pending':
        case 'Terminating':
        case 'ContainerCreating':
            return PodStatus.Pending;
        case 'Running':
        case 'Completed':
            return PodStatus.Success;
        case 'Failed':
        case 'InvalidImageName':
        case 'CrashLoopBackOff':
            return PodStatus.Failed;
        case 'ImagePullBackOff':
        case 'RegistryUnavailable':
            return PodStatus.Warning;
        default:
            return PodStatus.Unknown;
    }
};

export const PodIcon = (props: {status: string}) => {
    const {status} = props;
    let icon;
    let spin = false;
    if (status.startsWith('Init:')) {
        icon = faCircleNotch;
        spin = true;
    }
    if (status.startsWith('Signal:') || status.startsWith('ExitCode:')) {
        icon = faTimes;
    }
    if (status.endsWith('Error') || status.startsWith('Err')) {
        icon = faExclamationCircle;
    }

    const className = ParsePodStatus(status);

    switch (className) {
        case PodStatus.Pending:
            icon = faCircleNotch;
            spin = true;
            break;
        case PodStatus.Success:
            icon = faCheck;
            break;
        case PodStatus.Failed:
            icon = faTimes;
            break;
        case PodStatus.Warning:
            icon = faExclamationTriangle;
            break;
        default:
            spin = false;
            icon = faQuestionCircle;
            break;
    }

    return (
        <ThemeDiv className={`pod-icon pod-icon--${className}`}>
            <FontAwesomeIcon icon={icon} spin={spin} />
        </ThemeDiv>
    );
};

export const PodWidget = (props: {pod: Pod}) => (
    <Menu items={[{label: 'Copy Name', action: () => navigator.clipboard.writeText(props.pod.objectMeta?.name), icon: faClipboard}]}>
        <Tooltip
            content={
                <div>
                    <div>Status: {props.pod.status}</div>
                    <div>{props.pod.objectMeta?.name}</div>
                </div>
            }>
            <PodIcon status={props.pod.status} />
        </Tooltip>
    </Menu>
);
