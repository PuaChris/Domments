import React from 'react';
import { shallow } from 'enzyme';
import { toContainReact } from 'jest-enzyme';
import CommentList from './CommentList';
import CommentListAddBtn from './CommentListAddBtn';


describe('<CommentList />', () => {
  it('renders a <CommentListAddBtn />', () => {
    const wrapper = shallow(<CommentList />);
    const commentListAddBtn = <CommentListAddBtn/>;
    // expect(wrapper.find(CommentListAddBtn)).to.have.lengthOf(1);
    // expect(wrapper).toContainReact(commentListAddBtn);
  });
});