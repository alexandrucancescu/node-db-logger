import {describe,it} from "mocha"
import {expect} from "chai"
import RulesOverseer from "../lib/helper/RulesOverseer";
import {Request,Response} from "express"

describe("Rules Overseer",()=>{
	it("should return the correct act based on path rules",returnsCorrectActPathRules)
	it("should return the merged act from multiple rules",returnsMergedActFromRules)
});

function returnsCorrectActPathRules(){
	const response={headersSent:true} as Response;

	const overseer=new RulesOverseer([
		{path:"/**",do:{skip:true}},
		{path:"/company",do:{skip:false}},
		{path:"/company/user",do:{skip:true}},
		{path:"/company/user/admin",do:{skip:false,set:{request:{userData:true}}}},
	]);

	expect(overseer.computeRouteAct(<Request>{url:"/index"},response))
		.to.deep.equal({skip:true});

	expect(overseer.computeRouteAct(<Request>{url:"/company"},response))
		.to.deep.equal({skip:false});

	expect(overseer.computeRouteAct(<Request>{url:"/company/user"},response))
		.to.deep.equal({skip:true});

	expect(overseer.computeRouteAct(<Request>{url:"/company/user/admin"},response))
		.to.deep.equal({skip:false,set:{request:{userData:true}}});

}

function returnsMergedActFromRules(){
	const response={headersSent:true} as Response;

	const overseer=new RulesOverseer([
		{path:"/**",do:{skip:true}},
		{path:"/company",do:{set:{request:{headers:["user-agent"]}}}},
		{path:"/company/user",do:{skip:false,set:{response:{body:true}}}},
		{path:"/company/user/admin",do:{skip:false,set:{request:{userData:true}}}},
	]);

	expect(overseer.computeRouteAct(<Request>{url:"/company/user"},response))
		.to.deep.equal({skip:true});



	expect(overseer.computeRouteAct(<Request>{url:"/company"},response))
		.to.deep.equal({skip:false});

	expect(overseer.computeRouteAct(<Request>{url:"/company/user"},response))
		.to.deep.equal({skip:true});

	expect(overseer.computeRouteAct(<Request>{url:"/company/user/admin"},response))
		.to.deep.equal({skip:false,set:{request:{userData:true}}});

}
