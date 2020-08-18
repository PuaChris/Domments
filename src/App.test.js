import React from 'react';
import ReactDOM from 'react-dom';
import { shallow } from 'enzyme';
import App from './App';

// * shallow() isolates the given component from its child components
// * mount() fully renders the DOM using a library called jsdom to make it "look like" a browser environment
describe("<App/>", () => {
  it("Renders without crashing", () => {
    const wrapper = shallow(<App />);
    expect(wrapper.exists()).toBe(true);
  });
});
