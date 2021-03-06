import React from 'react'
import './storyLine.less'
import $ from 'jquery'
import {Link} from 'react-router'
import * as tool from '../../../config/tools'
import * as api from '../../../config/api'
import {message} from 'antd'
var lineIndex=0;
class StoryLine extends React.Component{
	constructor(args){
		super();
		this.state={
			chapter:'',
			sex:'man',
		}
	}
	componentWillMount() {
    	this.show()
  	}
  	show(){
  		api.selectuserDetail().then((data) => {
	      if (data.result === 'RC100') {
	        this.setState({
		         chapter:data.chapter,
				    	sex:data.sex===1?'man':'woman'
	        },()=>{
						var chapter=this.state.chapter;
	          $('.base').click(function(){
						$(this).addClass('active').siblings().removeClass('active');
						$(this).addClass('active').siblings().find('.fxz').fadeOut();
						var index = $(this).index();
						var data = ['楔子','第一章','第二章','第三章','第四章','第五章','第六章','第七章']
						var data1 = ['楔子','天道不公','人道不平','血性儿郎','无良军痞','第五章','第六章','第七章'];
	         if(index<=chapter){
						  $(this).find('.fxz').fadeIn();
					   	$('.story-link').show();
	            $('.story-link p').html(data1[index]);
	            $(this).find('.fxz').html('<h2>'+data[index]+'</h2>');
	            lineIndex=index;
	          }else{
							$('.story-link').hide();
	            $('.story-link p').html('');
							$(this).find('.fxz').html('<h2></h2>');
							 $('.base').addClass('active').siblings().removeClass('active');
							message.warning("未解锁",3)
						}
					})
					})
	      } else {
	        message.error(data.errMsg, 3);
	      }
	    }, (res) => {
	      tool.reject(res);
	    })
  	}
	render(){
		let sex=this.state.sex;
		return(
		    <div className="story-box">
          <Link to={`/App/StoryLine/StoryDetail/${lineIndex}`} className="story-link" style={{display: 'none'}}></Link>
		    	<div className="island">
          <div className="base base-1">
              <div className="light"></div>
              <div className={`fxz ${sex}`}>
              </div>
          </div>
		    		<div className="base base-2"><a><div className="light"></div><div className={`fxz ${sex}`}></div></a></div>
		    		<div className="base base-3"><a><div className="light"></div><div className={`fxz ${sex}`}></div></a></div>
		    		<div className="base base-4"><a><div className="light"></div><div className={`fxz ${sex}`}></div></a></div>
		    		<div className="base base-5"><a><div className="light"></div><div className={`fxz ${sex}`}></div></a></div>
		    		<div className="base base-6"><a><div className="light"></div><div className={`fxz ${sex}`}></div></a></div>
		    		<div className="base base-7"><a><div className="light"></div><div className={`fxz ${sex}`}></div></a></div>
		    		<div className="base base-8"><a><div className="light"></div><div className={`fxz ${sex}`}></div></a></div>
		    	</div>
					<Link to={"/App/IntegralRules"} className="point-rule">积分规则</Link>
				
				</div>
		)
	}

}

export default StoryLine