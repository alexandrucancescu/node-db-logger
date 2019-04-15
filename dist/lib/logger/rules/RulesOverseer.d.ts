import RouteRule, { Act } from "../../domain/access-log/RouteRule";
import { Request, Response } from "express";
export default class RulesOverseer {
    private readonly rules;
    private readonly trimSlash;
    constructor(rules: RouteRule[], trimSlash?: boolean);
    computeRouteAct(req: Request, res: Response): Act;
    private getRulesMatched;
}
