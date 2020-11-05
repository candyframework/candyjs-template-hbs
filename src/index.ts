import * as fs from 'fs';

import * as Candy from 'candyjs/Candy';
import * as View from 'candyjs/web/View';

import * as Handlebars from 'handlebars';

/**
 * 视图
 */
export default class Index extends View {

    /**
     * @property {Boolean} output 是否直接输出
     * @since 0.1.4
     */
    public output: boolean = true;

    /**
     * @property {Boolean} enableLayout 是否开启布局视图
     */
    public enableLayout: boolean = false;

    /**
     * @property {String} layout 布局文件路径
     */
    public layout: string = '@app/views/layout';

    /**
     * @property {String} title 页面标题
     */
    public title: string = '';

    /**
     * @property {String} keywords 页面关键字
     */
    public keywords: string = '';

    /**
     * @property {String} description 页面描述
     */
    public description: string = '';

    /**
     * @property {String} contentHtml 内容 html
     */
    public contentHtml: string = '';

    /**
     * @property {Array} headAssets Head 部分资源
     */
    public headAssets: string[] = null;

    /**
     * @property {Array} footerAssets Footer 部分资源
     */
    public footerAssets: string[] = null;

    public handlebars: typeof Handlebars = Handlebars.create();

    constructor(context: any) {
        super(context);
    }

    /**
     * 获取 head 部分资源
     *
     * @since 0.1.3
     * @return {String}
     */
    public getHeadAssets = (): string => {
        return null === this.headAssets ? '' : this.headAssets.join('\n');
    }

    /**
     * 添加 head 部分资源
     *
     * @since 0.1.3
     * @param {String} asset 资源
     */
    public addHeadAsset = (asset: string): void => {
        if(null === this.headAssets) {
            this.headAssets = [];
        }

        this.headAssets.push(asset);
    }

    /**
     * 获取 footer 部分资源
     *
     * @since 0.1.3
     * @return {String}
     */
    public getFooterAssets = (): string => {
        return null === this.footerAssets ? '' : this.footerAssets.join('\n');
    }

    /**
     * 添加 footer 部分资源
     *
     * @since 0.1.3
     * @param {String} asset 资源
     */
    public addFooterAsset = (asset: string): void => {
        if(null === this.footerAssets) {
            this.footerAssets = [];
        }

        this.footerAssets.push(asset);
    }

    /**
     * 渲染文件
     */
    public async renderFile(file: string, parameters: any) {
        let viewData = await fs.promises.readFile(file, {encoding: Candy.app.encoding});
        let compiled = this.handlebars.compile(viewData);

        this.contentHtml = compiled({
            $this: this,
            ...parameters
        });

        if(this.enableLayout) {
            let layoutFile = Candy.getPathAlias(this.layout + this.defaultExtension);
            let layoutData = await fs.promises.readFile(layoutFile, {encoding: Candy.app.encoding});

            compiled = this.handlebars.compile(layoutData);
            this.contentHtml = compiled({
                $this: this,
                parameters: parameters,
                title: this.title,
                description: this.description,
                contentHtml: this.contentHtml
            });
        }

        if(!this.output) {
            return this.contentHtml;
        }

        return this.context.response.end( this.contentHtml );
    }

}
