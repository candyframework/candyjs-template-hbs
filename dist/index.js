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
         * @property {Boolean} output 是否直接输出
         * @since 0.1.4
         */
        this.output = true;
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
         * @property {String} keywords 页面关键字
         */
        this.keywords = '';
        /**
         * @property {String} description 页面描述
         */
        this.description = '';
        /**
         * @property {String} contentHtml 内容 html
         */
        this.contentHtml = '';
        /**
         * @property {Array} headAssets Head 部分资源
         */
        this.headAssets = null;
        /**
         * @property {Array} footerAssets Footer 部分资源
         */
        this.footerAssets = null;
        this.handlebars = Handlebars.create();
        /**
         * 获取 head 部分资源
         *
         * @since 0.1.3
         * @return {String}
         */
        this.getHeadAssets = () => {
            return null === this.headAssets ? '' : this.headAssets.join('\n');
        };
        /**
         * 添加 head 部分资源
         *
         * @since 0.1.3
         * @param {String} asset 资源
         */
        this.addHeadAsset = (asset) => {
            if (null === this.headAssets) {
                this.headAssets = [];
            }
            this.headAssets.push(asset);
        };
        /**
         * 获取 footer 部分资源
         *
         * @since 0.1.3
         * @return {String}
         */
        this.getFooterAssets = () => {
            return null === this.footerAssets ? '' : this.footerAssets.join('\n');
        };
        /**
         * 添加 footer 部分资源
         *
         * @since 0.1.3
         * @param {String} asset 资源
         */
        this.addFooterAsset = (asset) => {
            if (null === this.footerAssets) {
                this.footerAssets = [];
            }
            this.footerAssets.push(asset);
        };
    }
    /**
     * 渲染文件
     */
    async renderFile(file, parameters) {
        let viewData = await fs.promises.readFile(file, { encoding: Candy.app.encoding });
        let compiled = this.handlebars.compile(viewData);
        this.contentHtml = compiled(Object.assign({ $this: this }, parameters));
        if (this.enableLayout) {
            let layoutFile = Candy.getPathAlias(this.layout + this.defaultExtension);
            let layoutData = await fs.promises.readFile(layoutFile, { encoding: Candy.app.encoding });
            compiled = this.handlebars.compile(layoutData);
            this.contentHtml = compiled({
                $this: this,
                parameters: parameters,
                title: this.title,
                description: this.description,
                contentHtml: this.contentHtml
            });
        }
        if (!this.output) {
            return this.contentHtml;
        }
        return this.context.response.end(this.contentHtml);
    }
}
exports.default = Index;
