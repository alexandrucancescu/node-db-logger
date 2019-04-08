import RouteRule from "../domain/access-log/RouteRule";
import {cleanUrl} from "../../../dist/lib/util/Generic";
import debug from "../util/DebugLog"
import normalizeRules from "./RulesNormalize";

export default class RulesOverseer{
	private readonly rules:RouteRule[];

	constructor(rules:RouteRule[]){
		this.rules=normalizeRules(rules);
	}
}