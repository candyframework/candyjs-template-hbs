"use strict";
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
         * @property {String} contentHtml 内容 html
         */
        this.contentHtml = '';
        this.handlebars = Handlebars.create();
    }
    /**
     * 渲染文件
     */
    async renderFile(file, parameters) {
        let viewData = '';
        try {
            viewData = await fs.promises.readFile(file, { encoding: Candy.app.encoding });
        }
        catch (e) {
            if (Candy.app.debug) {
                viewData = e.message;
            }
        }
        let compiled = this.handlebars.compile(viewData);
        this.contentHtml = compiled(Object.assign({ $this: this }, parameters));
        if (this.enableLayout) {
            let layoutFile = Candy.getPathAlias('@' + this.layout + this.defaultExtension);
            let layoutData = '';
            try {
                layoutData = await fs.promises.readFile(layoutFile, { encoding: Candy.app.encoding });
            }
            catch (e) {
                if (Candy.app.debug) {
                    layoutData = e.message;
                }
            }
            compiled = this.handlebars.compile(layoutData);
            this.contentHtml = compiled({
                $this: this,
                parameters: parameters,
                contentHtml: this.contentHtml
            });
        }
        if (this.output) {
            this.context.response.write(this.contentHtml);
            this.context.response.end();
            this.contentHtml = '';
        }
        return this.contentHtml;
    }
}
exports.default = Index;
