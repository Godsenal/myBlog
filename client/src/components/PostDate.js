import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {browserHistory} from 'react-router';
import classNames from 'classnames/bind';

import moment from 'moment';
import scss from '../../../style/PostDate.scss';
import { create } from 'domain';

const sc = classNames.bind(scss);

const MAX_MONTH = 10;
class PostDate extends Component{
  
  handleDateClick = (i) => {
    console.log(i);
    let year = moment(Date.now()).subtract(i,'months').get('year');
    let month = moment(Date.now()).subtract(i,'months').get('month') + 1 // 0 to 11;
    browserHistory.push(`/date/${year}/${month}`);
  }
  render(){
    return(
      <div>
        {Array(MAX_MONTH).fill().map((el,i)=>{
          return <div key={i}><span className={sc('date-item')} onTouchTap={()=>this.handleDateClick(i)}>{moment(Date.now()).subtract(i,'months').format('YYYY / MM')}</span></div>;
        })}
      </div>
    );
  }
}
export default PostDate;
