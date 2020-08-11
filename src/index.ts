import * as fs from 'fs';

import * as Candy from 'candyjs/Candy';
import * as View from 'candyjs/web/View';

import * as Handlebars from 'handlebars';

/**
 * 视图
 */
export default class Index extends View {

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
     * @property {String} description 页面描述
     */
    public description: string = '';

    /**
     * @property {String} contentHtml 内容 html
     */
    public contentHtml: string = '';

    public handlebars: typeof Handlebars = Handlebars.create();

    constructor(context: any) {
        super(context);
    }

    /**
     * 渲染文件
     */
    async renderFile(file: string, parameters: any) {
        let viewData = await fs.promises.readFile(file, {encoding: Candy.app.encoding});
        let compiled = this.handlebars.compile(viewData);

        this.contentHtml = compiled(parameters);

        if(this.enableLayout) {
            let layoutFile = Candy.getPathAlias(this.layout + this.defaultExtension);
            let layoutData = await fs.promises.readFile(layoutFile, {encoding: Candy.app.encoding});

            compiled = this.handlebars.compile(layoutData);
            this.contentHtml = compiled({
                $parameters: parameters,
                title: this.title,
                description: this.description,
                contentHtml: this.contentHtml
            });
        }

        this.context.response.end( this.contentHtml );
    }

}
