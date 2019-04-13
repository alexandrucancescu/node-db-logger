import {describe,it} from "mocha"
import {expect} from "chai"

import normalize, {RuleValidationError} from "../lib/helper/RulesNormalize"
import Logger from "../lib/Logger";
import RouteRule from "../lib/domain/access-log/RouteRule";

Logger.configuration.debug=false;

describe("Rules normalization",()=>{
	it("should throw for invalid rules",throwsForInvalidRules);
 	describe("Paths",()=>{
 		it("should throw for rules with invalid paths",throwsForInvalidPaths);
 		it("should clean paths URLs",cleansPathsUrls);
		it("should convert glob pattern paths to regex",convertsGlobPathsToRegex);
		it("should correctly resolve glob paths",correctlyResolvesGlobPaths);
	});
 	describe("Priority property",()=>{
 		it("should add property priority if missing, in correlation with the order defined",addsMissingPriority)
	});
 	describe(".if conditional properties",()=>{
 		it("should delete invalid .if properties",deletesInvalidIfProperties);
 		it("should delete .if properties with invalid conditions or empty object",deletesEmptyIfProperties);
 		describe(".statusCode property",()=>{
			it("should remove invalid status codes",removesInvalidStatusCodes);
		});
 		describe(".contentType property",()=>{
 			it("should remove invalid content types values",removesInvalidContentTypeValues)
		});
 		describe(".test function",()=>{
 			it("should remove invalid .test functions",removesInvalidTestFunctions);
			it("should wrap .test function into a safe call that only returns boolean",wrapsTestFunctions);
		})
	});
 	describe(".do act property",()=>{
 		it("should throw error for rules with invalid .do properties",throwsForInvalidDoProps);
		describe("Skip property",()=>{
			it("should throw if .skip is not a boolean",throwsWhenSkipNotBoolean)
		});
	})
});

function throwsForInvalidDoProps(){
	const rules=getMockRules("do",[
		{skip:true},false,{},null
	]);

	expect(normalize.bind(null,rules)).to.throw;
}

function deletesInvalidIfProperties(){
	const rules=getMockRules("if",[
		{statusCode:400}, true , 45, ""
	]);

	const normalized=normalize(rules);

	expect(normalized[0]).to.have.ownProperty("if");

	expect(normalized[1]).to.not.have.ownProperty("if");
	expect(normalized[2]).to.not.have.ownProperty("if");
	expect(normalized[3]).to.not.have.ownProperty("if");
}

function deletesEmptyIfProperties(){
	const rules=getMockRules("if",[
		{statusCode:[]}, {statusCode:["1",null]},
		{statusCode:0,test:true,contentType:""},{},null
	]);

	const normalized=normalize(rules);

	normalized.forEach((rule,index)=>{
		expect(rule,`Rule at [${index}]`).to.not.have.property("if");
	})
}

function wrapsTestFunctions(){
	const rules=getMockIfRules("test",[
		()=>"Rebel",
		()=>{throw new Error()}
	]);
	const normalized=normalize(rules);

	expect(normalized[0].if.test).to.not.throw;
	expect(normalized[0].if.test()).to.equal(false);

	expect(normalized[1].if.test).to.not.throw;
	expect(normalized[1].if.test()).to.equal(false);
}

function removesInvalidTestFunctions(){
	const rules:RouteRule[]=getMockIfRules("test",[
		null,
		new Date(),
		()=>{},
		"do{}while()",
	]);
	const normalized=normalize(rules);

	expect(normalized[0].if).to.not.have.ownProperty("test");
	expect(normalized[1].if).to.not.have.ownProperty("test");
	expect(normalized[3].if).to.not.have.ownProperty("test");

	expect(normalized[2].if).to.have.ownProperty("test");
}

function removesInvalidContentTypeValues(){
	const rules:RouteRule[]=getMockIfRules("contentType",[
		30, //gets removed
		{x:1}, //gets removed
		"application/json", //stays
		[""], //gets removed
		[30,"*/*","media/*","",null,new Date()]//[1] and [2] remain
	]);
	const normalized=normalize(rules);
	
	expect(normalized[0].if).to.not.have.ownProperty("contentType");
	expect(normalized[1].if).to.not.have.ownProperty("contentType");

	expect(normalized[2].if).to.have.ownProperty("contentType");

	expect(normalized[3].if).to.not.have.ownProperty("contentType");

	expect(normalized[4].if).to.have.ownProperty("contentType");

	expect(normalized[2].if.contentType).to.equal("application/json");

	expect(normalized[4].if.contentType).to.have.length(2);
	expect(normalized[4].if.contentType).to.deep.equal(["*/*","media/*"]);
}

function removesInvalidStatusCodes(){
	const rules:RouteRule[]=getMockIfRules("statusCode",[
		30,4500,300,["4**"],[30,500,"4**","5*",null,new Date()]
	]);
	const normalized=normalize(rules);

	expect(normalized[0].if).to.not.have.ownProperty("statusCode");
	expect(normalized[1].if).to.not.have.ownProperty("statusCode");

	expect(normalized[2].if).to.have.ownProperty("statusCode");
	expect(normalized[3].if).to.have.ownProperty("statusCode");
	expect(normalized[4].if).to.have.ownProperty("statusCode");

	expect(normalized[2].if.statusCode).to.equal(300);
	expect(normalized[3].if.statusCode).to.deep.equal(["4**"]);

	expect(normalized[4].if.statusCode).to.have.length(2);
	expect(normalized[4].if.statusCode).to.deep.equal([500,"4**"]);

}

function addsMissingPriority(){
	const rules=[] as RouteRule[];

	for(let i=0;i<20;i++){
		rules.push({path:"/",do:{}});
	}

	const normalized=normalize(rules);

	for(let i=0;i<normalized.length;i++){
		const rule=normalized[i];
		expect(rule).to.haveOwnProperty("priority");
		expect(rule.priority).to.be.a("number");

		if(i===0){
			expect(rule.priority).to.be.greaterThan(0);
			continue;
		}else{
			expect(rule.priority).to.be.greaterThan(normalized[i-1].priority);
		}
		if(i===normalized.length-1){ //last one
			expect(rule.priority).to.be.lessThan(1);
		}
	}
}

function cleansPathsUrls(){
	const rules:RouteRule[]=getMockRules("path",["/url/","/url?x=21&y=33","///"]);

	const normalized=normalize(rules);

	expect(normalized[0].path).to.equal("/url");
	expect(normalized[1].path).to.equal("/url");

	//URL cleaning still expects valid paths. It will only remove trailing slashes
	expect(normalized[2].path).to.equal("//");
}

function convertsGlobPathsToRegex(){
	const rules:RouteRule[]=[
		{path:"/users/index",do:{skip:false}}, //Stays the same
		{path:"/users/**",do:{skip:false}}, //Is converted to regex
		{path:"/**/index.html",do:{skip:false}} //Is converted to regex
	];
	const normalized=normalize(rules);

	expect(normalized).to.have.length(3);

	expect(normalized[0].path).to.be.a("string");
	expect(normalized[1].path).to.be.instanceOf(RegExp);
	expect(normalized[2].path).to.be.instanceOf(RegExp);
}

function correctlyResolvesGlobPaths(){
	const rules:RouteRule[]=[
		{path:"/users/**",do:{skip:false}}, //Is converted to regex
		{path:"/**/index.html",do:{skip:false}} //Is converted to regex
	];
	const normalized=normalize(rules);

	expect(normalized[0].path).to.be.instanceOf(RegExp);

	const first=normalized[0].path as RegExp;

	expect(first.test("/")).to.be.false;
	expect(first.test("/users")).to.be.false;
	expect(first.test("")).to.be.false;
	expect(first.test("/users/available/today")).to.be.true;

	const second=normalized[1].path as RegExp;

	expect(second.test("/")).to.be.false;
	expect(second.test("")).to.be.false;
	expect(second.test("/l1/l2/l3/l4")).to.be.false;
	expect(second.test("/index.html")).to.be.true;
	expect(second.test("/l1/l2/l3/l4/index.html")).to.be.true;
	expect(second.test("/l1/index.html")).to.be.true;
}

function throwsWhenSkipNotBoolean(){
	const rules=getMockDoRules("skip",[
		null,"false",1,0
	]);

	for(let rule of rules){
		expect(normalize.bind(null,[rule])).to.throw(RuleValidationError)
			.that.has.property("key").that.equals("do.skip");
	}

}

function throwsForInvalidPaths(){
	const rules=getMockRules("path",[
		45,null,"",{}
	]);

	for(let rule of rules){
		expect(normalize.bind(null,[rule])).to.throw(RuleValidationError)
			.that.has.property("key").that.equals("path");
	}
}

function throwsForInvalidRules(){
	const rules=[null,4450,"/users",false];

	for(let rule of rules){
		expect(normalize.bind(null,[rule])).to.throw(RuleValidationError);
	}
}

function getMockIfRules(withIfKey:string,values:any[]):RouteRule[]{
	return values.map(v=>{
		let mock={
			path:"/",
			if:{
				requestUnfulfilled:true,
				statusCode:"5**",
			},
			do:{skip:false}
		} as RouteRule;
		mock.if[withIfKey]=v;
		return mock;
	})
}

function getMockDoRules(withIfKey:string,values:any[]):RouteRule[]{
	return values.map(v=>{
		let mock={
			path:"/",
			do:{
				skip:false,
			}
		} as RouteRule;
		mock.do[withIfKey]=v;
		return mock;
	})
}

function getMockRules(withKey:string,values:any[]):RouteRule[]{
	return values.map(v=>{
		let rule={
			path:"/",
			do:{
				skip:false,
			}
		};
		rule[withKey]=v;
		return rule;
	})
}