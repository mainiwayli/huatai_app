import React from 'react'
import './course.less'
import { message , Spin } from 'antd';
import * as api from '../../config/api';
import * as tool from '../../config/tools';
//import CourseItem from './CourseItem.jsx';
import {hashHistory} from 'react-router';
class Course extends React.Component {
  constructor(args) {
    super()
    this.state = {
      tab: 2,
      courseList: [],
      loading: false,
      pageNo: 1,
      elecReqCourse: 2,
      goodCourse: '',
      score:0,
      totalPage:0,
      now_item: {
				studyIntegral:0
			}
    }
  }
  componentDidMount() {
    tool.addScroll(this,this.show.bind(this));
  }
  componentWillUnmount() {
    tool.removeScroll();
  }
  changeTab(tab) {
    let elecReqCourse = 0;
    let goodCourse = 1;
    switch (tab) {
      case 1:
        goodCourse = 1;
        elecReqCourse = 0;
        break;
      case 2:
        goodCourse = '';
        elecReqCourse = 2;
        break;
      case 3:
        goodCourse = 0;
        elecReqCourse = 1;
        break;
      default:
        break;
    }
    this.setState({
      tab,
      elecReqCourse,
      goodCourse,
      pageNo:1
    }, () => {
      this.show();
    })
  }
  componentWillMount() {
    this.show();
  }
  componentWillReceiveProps(nextProps) {
    this.show();
  }
  show(flag) {
    tool.loading(this, true);
    let body = {
      currentPage: this.state.pageNo,
      courseName: tool.getQueryString('search'),
      elecReqCourse: this.state.elecReqCourse,
      goodCourse: this.state.goodCourse
    }
    api.appStudentSelectCoursePager(body).then((data) => {
      if (data.result === 'RC100') {
        this.setState({
          courseList: flag?this.state.courseList.concat(data.coursePage.pageItems):data.coursePage.pageItems,
          score:data.score,
          totalPage:data.coursePage.totalPage
        })
      } else {
        this.setState({
          courseList:[],
          totalPage:0
        })
        message.error(data.errMsg, 3);
      }
      tool.loading(this, false);
    }, (res) => {
      tool.loading(this, false);
      tool.reject(res);
    })
  }

  jump(item) {
		if (item.goodCourse !== '1' || item.userCourseOperation.isBuy === 1) {
			hashHistory.push(`/App/Course/courseDetail/${item.courseId}`);
			return;
		}
		this.setState({
			now_item: item
		})
	}
  ok() {
		let body = {
			courseId: this.state.now_item.courseId
		}
		api.cashcourse(body).then((data) => {
			if (data.result === 'RC100') {
				hashHistory.push(`/App/Course/courseDetail/${this.state.now_item.courseId}`);
			} else {
				message.error(data.errMsg, 1);
			}
			tool.loading(this, false);
		}, (res) => {
			tool.loading(this, false);
			tool.reject(res);
		})
	}
  action(courseId,recordType){
		let body = {
			courseId,
			recordType
		};
		api.operatecourse(body).then((data) => {
			if (data.result === 'RC100') {
				this.show();
			} else {
				message.error(data.errMsg, 1);
			}
			tool.loading(this, false);
		}, (res) => {
			tool.loading(this, false);
			tool.reject(res);
		})
	}
  click(item){
		if (item.goodCourse !== '1' || item.userCourseOperation.isBuy === 1) {
			this.action(item.courseId,2);
			return;
		}
		this.setState({
			now_item: item
		})
	}
	render(){
		return(
             <div className="warpper">
              
                  <div data-am-widget="tabs" className="am-tabs am-tabs-default">
                    <ul className="am-tabs-nav am-cf nav">
                      <li className={this.state.tab===1?'am-active':null} onClick={()=>this.changeTab(1)} >
                        <a>精品课程</a>
                      </li>
                      <li className={this.state.tab===2?'am-active':null} onClick={()=>this.changeTab(2)}>
                        <a>热播课程</a>
                      </li>
                      <li className={this.state.tab===3?'am-active':null} onClick={()=>this.changeTab(3)}>
                        <a>必修课程</a>
                      </li>
                    </ul>
                    <div className="am-tabs-bd">
                      <Spin spinning={this.state.loading} tip="加载列表中...">
					             <div data-tab-panel-0 className="am-tab-panel am-active tab">
					             	<ul className="cur-list am-avg-lg-2 am-avg-md-2 am-avg-sm-2 clearFix">
                       {this.state.courseList.map((item,index)=>{
                         return(
                          <li key={index}>
                          <a>
                            <img onClick={()=>this.jump(item)} data-am-modal={item.goodCourse ==='1' && item.userCourseOperation.isBuy !== 1?`{target: '#course-confirm'}`:""} src={require('../../style/images/test.png')} alt='test'/>
                            <p onClick={()=>this.jump(item)} data-am-modal={item.goodCourse ==='1' && item.userCourseOperation.isBuy !== 1?`{target: '#course-confirm'}`:""} className="time">{tool.formatTimestamp(item.createTime)}</p>
                          </a>
                          <div className="cur-list-info">
                            <h2 onClick={()=>this.jump(item)} data-am-modal={item.goodCourse ==='1' && item.userCourseOperation.isBuy !== 1?`{target: '#course-confirm'}`:""}>{item.courseName}{item.goodCourse === '1'?<div className="jc-icon" />:null}</h2>
                            <p className="like">
                              <span className={item.userCourseOperation.isCollection===1?'active':''} data-am-modal={item.goodCourse ==='1' && item.userCourseOperation.isBuy !== 1?`{target: '#course-confirm'}`:""} onClick={()=>this.click(item)}><i className="fa fa-heart-o"></i>{item.sumCollection}</span>
                              <span className={item.userCourseOperation.isLike===1?'active':''} onClick={()=>this.action(item.courseId,3)}><i className="fa fa-thumbs-o-up"></i>{item.sumLike}</span>
                              </p>
                          </div>
                          </li>
                           )
                       })}
                     </ul>
                     </div>
                     </Spin>
                     </div>

         <div className="am-modal am-modal-confirm" tabIndex="-1" id={`course-confirm`}>
					<div className="am-modal-dialog">
						<div className="am-modal-hd">温馨提示</div>
						<div className="am-modal-bd">
						兑换课程将需要{this.state.now_item.studyIntegral}积分，您的当前积分为{this.state.score}，是否继续？
						</div>
						<div className="am-modal-footer">
						<span className="am-modal-btn" data-am-modal-cancel>取消</span>
						<span className="am-modal-btn" data-am-modal-confirm onClick={()=>this.ok()}>确定</span>
						</div>
						</div>
					</div>
                  </div>
                
              </div>

			)
	}
}
export default Course;