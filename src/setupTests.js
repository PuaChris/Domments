// jest-dom adds custom jest matchers for asserting on DOM nodes.
// allows you to do things like:
// expect(element).toHaveTextContent(/react/i)
// learn more: https://github.com/testing-library/jest-dom
import '@testing-library/jest-dom/extend-expect';
import Enzyme from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

// * File lets the testing env know to include this code into every test file
// * Enzyme: JavaScript Testing utility for React to make it easier to test the output of React Components
Enzyme.configure({ adapter: new Adapter() });