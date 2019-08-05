import React,{Component} from "react";
import $ from 'jquery';

export default class GrabData extends Component {

    constructor(props){
        super(props);
        this.data = "";
        this.set = this.set.bind(this);
        this.state = {done:false}
    }

    set(data){
        this.data = JSON.stringify(data);
        console.log(this.data,data);
        this.setState({done:true});
    }

    componentDidMount(){
        $.ajax({
            url: this.props.url,
            context: document.body,
            crossDomain: true
        }).done(this.set);
    }

    render(){
        
        return this.data
    }
}