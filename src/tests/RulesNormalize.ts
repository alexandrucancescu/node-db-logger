import {describe,it} from "mocha"
import {expect} from "chai"

import normalize from "../lib/helper/RulesNormalize"
import Logger from "../lib/Logger";
import RouteRule from "../lib/domain/access-log/RouteRule";

Logger.configuration.debug=false;

describe("Rules normalization",()=>{
 	describe("Paths",()=>{
 		it("should remove only rules with invalid paths",removesInvalidPaths);
 		it("should clean paths URLs",cleansPathsUrls)
	});
 	describe("Skip property",()=>{
		it("should handle property skip not boolean",handlesSkipNotBoolean)
	});
 	describe("Priority property",()=>{
 		it("should remove priority property if wrong type",handlesPriorityPropertyWrongType)
	});
 	describe("Conditional properties",()=>{
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
});

function wrapsTestFunctions(){
	const rules:RouteRule[]=getMockRules("if",[
		{
			test(){
				return "Rebel";
			}
		},
		{
			test(){
				throw new Error();
			}
		}
	]);
	const normalized=normalize(rules);

	expect(normalized[0].if.test).to.not.throw;
	expect(normalized[0].if.test()).to.equal(false);

	expect(normalized[1].if.test).to.not.throw;
	expect(normalized[1].if.test()).to.equal(false);
}

function removesInvalidTestFunctions(){
	const rules:RouteRule[]=getMockRules("if",[
		{test:null},
		{test:new Date()},
		{test:()=>{}},
		{test:"do{}while()"},
	]);
	const normalized=normalize(rules);

	expect(normalized[0].if).to.not.have.ownProperty("test");
	expect(normalized[1].if).to.not.have.ownProperty("test");
	expect(normalized[3].if).to.not.have.ownProperty("test");

	expect(normalized[2].if).to.have.ownProperty("test");
}

function removesInvalidContentTypeValues(){
	const rules:RouteRule[]=getMockRules("if",[
		{contentType:30},
		{contentType:{x:1}},
		{contentType:"application/json"},
		{contentType:[""]},
		{contentType:[30,"*/*","media/*","",null,new Date()]}
	]);
	const normalized=normalize(rules);

	expect(normalized[0].if).to.not.have.ownProperty("contentType");
	expect(normalized[1].if).to.not.have.ownProperty("contentType");

	expect(normalized[2].if).to.have.ownProperty("contentType");
	expect(normalized[3].if).to.have.ownProperty("contentType");
	expect(normalized[4].if).to.have.ownProperty("contentType");

	expect(normalized[2].if.contentType).to.equal("application/json");
	expect(normalized[3].if.contentType).to.have.length(0);

	expect(normalized[4].if.contentType).to.have.length(2);
	expect(normalized[4].if.contentType).to.deep.equal(["*/*","media/*"]);
}

function removesInvalidStatusCodes(){
	const rules:RouteRule[]=getMockRules("if",[
		{statusCode:30},{statusCode:"4500"},{statusCode:300},{statusCode:["4**"]},
		{statusCode:[30,500,"4**","5*",null,new Date()]}
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

function handlesPriorityPropertyWrongType(){
	const rules:RouteRule[]=getMockRules("priority",[null,"34",{},55]);
	const normalized=normalize(rules);

	expect(normalized[0]).to.not.have.ownProperty("priority");
	expect(normalized[1]).to.not.have.ownProperty("priority");
	expect(normalized[2]).to.not.have.ownProperty("priority");
	expect(normalized[3]).to.have.ownProperty("priority");
	expect(normalized[3].priority).to.equal(55);
}

function cleansPathsUrls(){
	const rules:RouteRule[]=getMockRules("path",["/url/","/url?x=21&y=33","///"]);

	const normalized=normalize(rules);

	expect(normalized[0].path).to.equal("/url");
	expect(normalized[1].path).to.equal("/url");

	//URL cleaning still expects valid paths. It will only remove trailing slashes
	expect(normalized[2].path).to.equal("//");
}

function handlesSkipNotBoolean(){
	// @ts-ignore
	const rules:RouteRule[]= getMockRules("skip",["false","true",null,true]);
	const normalized=normalize(rules);

	expect(normalized).to.have.length(4);
	expect(normalized[0].skip).to.be.false;
	expect(normalized[1].skip).to.be.false;
	expect(normalized[2].skip).to.be.false;
	expect(normalized[3].skip).to.be.true;
}

function removesInvalidPaths(){
	const rules=[{path:null},{path:44},{path:""},{path:/\/.*/g}];
	// @ts-ignore
	const normalized=normalize(rules);

	expect(normalized).to.have.length(1);
	expect(normalized[0]).to.haveOwnProperty("path");
	expect(normalized[0].path).to.be.instanceOf(RegExp);
}

function getMockRules(withKey:string,values:any[]):RouteRule[]{
	return values.map(v=>{
		let rule={path:"/"};
		rule[withKey]=v;
		return rule;
	})
}