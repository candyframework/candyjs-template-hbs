import * as fs from 'fs';

import * as Candy from 'candyjs/Candy';
import * as View from 'candyjs/web/View';

import * as Handlebars from 'handlebars';

/**
 * 视图
 */
export default class Index extends View {

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
    public async renderFile(file: string, parameters: any): Promise<string> {
        let viewData = '';

        try {
            viewData = await fs.promises.readFile(file, {encoding: Candy.app.encoding});

        } catch(e) {
            if(Candy.app.debug) {
                viewData = e.message;
            }
        }

        let compiled = this.handlebars.compile(viewData);
        this.contentHtml = compiled({
            $this: this,
            ...parameters
        });

        if(this.enableLayout) {
            let layoutFile = Candy.getPathAlias('@' + this.layout + this.defaultExtension);
            let layoutData = '';

            try {
                layoutData = await fs.promises.readFile(layoutFile, {encoding: Candy.app.encoding});

            } catch(e) {
                if(Candy.app.debug) {
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

        if(this.output) {
            this.context.response.write(this.contentHtml);
            this.context.response.end();

            this.contentHtml = '';
        }

        return this.contentHtml;
    }

}
