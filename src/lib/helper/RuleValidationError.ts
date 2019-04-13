import {getProp} from "../util/Generic";
import PublicRouteRule , {Path} from "../domain/access-log/RouteRule";

type RouteRule=PublicRouteRule&{
	_originalPath?:Path
}

export default class RuleValidationError extends Error{
	private readonly rule:RouteRule;
	private readonly key:string;
	private readonly ruleIdentifier:string;

	constructor(rule:RouteRule,key?:string){
		super(null);

		if(rule!==undefined && rule!==null){
			this.ruleIdentifier=`with path='${rule._originalPath||rule.path}'`;
		}else{
			this.ruleIdentifier=String(rule);
		}

		super.message=`Validation error for rule ${this.ruleIdentifier} , for key ${this.key}`;

		this.rule=rule;
		this.key=key;
	}

	public shouldBe(type:string):this{
		const butIs=getProp(this.rule,this.key);
		super.message=`At rule ${this.ruleIdentifier}, key ${this.key} should be a ${type}, but is a ${typeof butIs} with value '${butIs}'`;
		return this;
	}

	public invalidRule():this{
		super.message=`Invalid rule ${this.ruleIdentifier}. RouteRule should be a object !== null`;
		return this;
	}

	public invalidKey():this{
		const value=getProp(this.rule,this.key);
		super.message=`At rule ${this.ruleIdentifier}, key ${this.key} has in invalid value=${value}`;
		return this;
	}

}