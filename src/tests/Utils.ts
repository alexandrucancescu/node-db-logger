import {describe,it} from "mocha"
import {expect} from "chai"
import {getProp,deleteProp} from "../lib/util/Generic";
import {mimeMatch,cleanUrl,wildcardNumberMatch,timeStringToMs} from "../lib/util/Parsing";


describe("Util functions",()=>{
	describe("Wildcard mime match",()=>{
		it("should match mime",mimeMatchTrue);
		it("should not match mime",mimeMatchFalse);
	});
	describe("Wildcard number match",()=>{
		it("should match number",wildcardNumberTrue);
		it("should not match number",wildcardNumberFalse);
		it("should throw error",wildcardNumberThrow)
	});
	describe("Clean URL",()=>{
		it("should return cleaned URL",cleanURL);
		it("should throw error",cleanURLThrow)
	});
	describe("Get nested property by name",()=>{
		it("should return the correct value for prop",getsCorrectProp);
		it("should return undefined for nonexistent prop",getPropReturnsUndefined)
	});
	describe("Delete nested property by name",()=>{
		it("should delete the right property",deletesCorrectProp);
		it("should return false when property does not exist",deletePropReturnsFalse)
	});
	describe("Time string to ms",()=>{
		it("should return the right ms representation of time string",returnsRightTimeMs)
		it("should return null for invalid time string",returnsNullForInvalidTimeStrings)
	});
});

function returnsNullForInvalidTimeStrings(){
	expect(timeStringToMs("10")).to.be.null;
	expect(timeStringToMs("..m")).to.be.null;
	expect(timeStringToMs(33 as any)).to.be.null;
}

function returnsRightTimeMs(){
	expect(timeStringToMs("10m")).to.be.approximately(600000,0.001);
	expect(timeStringToMs("10.1s")).to.be.approximately(10100,0.001);
	expect(timeStringToMs("10yr")).to.be.approximately(3.154e+11,1e11);
}

function deletePropReturnsFalse(){
	const obj={
		x:{
			y:{
				z:{
					w:99
				},
				v:{
					w:98,
				}
			}
		}
	};

	expect(deleteProp(obj,"x.y.wrong")).to.be.false;
	expect(deleteProp(null,"x.y.wrong")).to.not.throw;
	expect(deleteProp(null,"x.y.wrong")).to.be.false;

	expect(deleteProp(obj,null)).to.not.throw;
	expect(deleteProp(obj,null)).to.be.false;
}

function deletesCorrectProp(){
	const obj={
		x:{
			y:{
				z:{
					w:99
				},
				v:{
					w:98,
				}
			}
		}
	};

	expect(deleteProp(obj,"x.y.z.w")).to.be.true;
	expect(obj.x.y.z).to.not.haveOwnProperty("w");

	expect(deleteProp(obj,"x.y.z")).to.be.true;
	expect(obj.x.y).to.not.haveOwnProperty("z");
}

function getPropReturnsUndefined(){
	const obj={
		x:{
			y:{
				z:{
					w:99
				},
				v:{
					w:98,
				}
			}
		}
	};

	expect(getProp(obj,"x.y.www")).to.be.undefined;
	expect(getProp(obj,true as any)).to.be.undefined;
	expect(getProp(obj,"")).to.be.undefined;
}

function getsCorrectProp(){
	const obj={
		x:{
			y:{
				z:{
					w:99
				},
				v:{
					w:98,
				}
			}
		}
	};

	expect(getProp(obj,"x.y.z.w")).to.equal(99);
	expect(getProp(obj,"x.y.v.w")).to.equal(98);
	expect(getProp(obj,"x.y")).to.deep.equal({
		z:{w:99}, v:{w:98,}
	})
}

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