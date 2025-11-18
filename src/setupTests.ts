import Enzyme from 'enzyme'
import Adapter from '@cfaester/enzyme-adapter-react-18'

Enzyme.configure({ adapter: new Adapter() });

// Configure testing environment for React 18
(globalThis as any).IS_REACT_ACT_ENVIRONMENT = true;
