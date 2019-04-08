import {describe,it} from "mocha"
import {expect} from "chai"
import {mimeMatch,cleanUrl,wildcardNumberMatch} from "../lib/util/Generic";

describe("Util functions",()=>{
	describe("Wildcard mime match",()=>{
		it("should match mime",mimeMatchTrue);
		it("should not match mime",mimeMatchFalse);
	});
	describe("Wildcard number match",()=>{
		it("should match number",wildcardNumberTrue);
		it("should not match mime",wildcardNumberFalse);
		it("should throw error",wildcardNumberThrow)
	});
	describe("Clean URL",()=>{
		it("should return cleaned URL",cleanURL);
		it("should throw error",cleanURLThrow)
	});
});

function cleanURLThrow(){
	expect(cleanUrl.bind({},[45,"?"])).to.throw();
	expect(cleanUrl.bind({},null)).to.throw();
}

function cleanURL(){
	expect(cleanUrl("")).to.equal("/");
	expect(cleanUrl("/users/")).to.equal("/users");
	expect(cleanUrl("/users/?x=1")).to.equal("/users");
	expect(cleanUrl("/users?x=3")).to.equal("/users");
}

function wildcardNumberThrow(){
	expect(wildcardNumberMatch.bind({},undefined,""))
		.to.throw();
	expect(wildcardNumberMatch.bind({},40,[50,60]))
		.to.throw();
}

function wildcardNumberTrue(){
	expect(wildcardNumberMatch(501,"***"))
		.to.equal(true);
	expect(wildcardNumberMatch(501,"*01"))
		.to.equal(true);
	expect(wildcardNumberMatch(501,"5**"))
		.to.equal(true);
	expect(wildcardNumberMatch(0,"*"))
		.to.equal(true);
	expect(wildcardNumberMatch(533,"533"))
		.to.equal(true);
}

function wildcardNumberFalse(){
	expect(wildcardNumberMatch(501,"**"))
		.to.equal(false);
	expect(wildcardNumberMatch(501,"**2"))
		.to.equal(false);
	expect(wildcardNumberMatch(NaN,"*"))
		.to.equal(false);
	expect(wildcardNumberMatch(-1,"**"))
		.to.equal(false);
}

function mimeMatchTrue(){
	expect(mimeMatch("application/json; charset=utf-8","application/*"))
		.to.equal(true);
	expect(mimeMatch("image/jpeg; charset=utf-8","image/jpeg"))
		.to.equal(true);
	expect(mimeMatch("image/jpeg","*/*"))
		.to.equal(true);
	expect(mimeMatch("/","/"))
		.to.equal(true);
}

function mimeMatchFalse(){
	expect(mimeMatch("/","image/jpeg"))
		.to.equal(false);
	expect(mimeMatch(undefined,null))
		.to.equal(false);
	expect(mimeMatch({} as string,"image/jpeg"))
		.to.equal(false);
	expect(mimeMatch("*/*","/"))
		.to.equal(false);
	expect(mimeMatch("image/jpeg","application/*"))
		.to.equal(false);
}