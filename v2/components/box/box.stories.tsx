import * as React from 'react';

import {Box, BoxTitle} from './box';

export default {
	title: 'Box',
};

export const Default = () => (
	<Box>
		<BoxTitle>Title</BoxTitle>
		<div>Box content</div>
	</Box>
);
