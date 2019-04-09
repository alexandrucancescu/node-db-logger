import RouteRule from "../domain/access-log/RouteRule";
import { Request, Response } from "express";
export default class RulesOverseer {
    private readonly rules;
    constructor(rules: RouteRule[]);
    computeRouteAct(path: string, req: Request, res: Response): void;
    private getRulesForPath;
}
