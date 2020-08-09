"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs = require("fs");
const Candy = require("candyjs/Candy");
const View = require("candyjs/web/View");
const Handlebars = require("handlebars");
/**
 * 视图
 */
class Index extends View {
    constructor(context) {
        super(context);
        /**
         * @property {Boolean} enableLayout 是否开启布局视图
         */
        this.enableLayout = false;
        /**
         * @property {String} layout 布局文件路径
         */
        this.layout = '@app/views/layout';
        /**
         * @property {String} title 页面标题
         */
        this.title = '';
        /**
         * @property {String} description 页面描述
         */
        this.description = '';
        /**
         * @property {String} contentHtml 内容 html
         */
        this.contentHtml = '';
    }
    /**
     * 渲染文件
     */
    renderFile(file, parameters) {
        return __awaiter(this, void 0, void 0, function* () {
            let handlebars = Handlebars.create();
            let viewData = yield fs.promises.readFile(file, { encoding: Candy.app.encoding });
            let compiled = handlebars.compile(viewData);
            this.contentHtml = compiled(parameters);
            if (this.enableLayout) {
                let layoutFile = Candy.getPathAlias(this.layout + this.defaultExtension);
                let layoutData = yield fs.promises.readFile(layoutFile, { encoding: Candy.app.encoding });
                compiled = handlebars.compile(layoutData);
                this.contentHtml = compiled({
                    title: this.title,
                    description: this.description,
                    contentHtml: this.contentHtml
                });
            }
            this.context.response.end(this.contentHtml);
        });
    }
}
exports.default = Index;
