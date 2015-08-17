import {Readable} from 'stream';
import koa from 'koa';
import koaStatic from 'koa-static';
import koaRouter from 'koa-router';
import sources from './sources';

const app = koa();
const router = koaRouter();
const port = process.env.PORT || 3000;

const arrayStream = (array, min, max) => {
  const stream = Readable();
  stream._read = function() {
    this.push('[');
    for(; min < max; min++) {
      this.push(`"${sources[min]}"${min < max - 1 ? ',' : ''}`);
    }
    this.push(']');
    this.push(null);
  };
  return stream;
};

router.get('/sources/:offset/:limit', function*(next) {
  const {offset, limit} = {
    offset: parseInt(this.params.offset),
    limit: parseInt(this.params.limit)
  };
  this.body = arrayStream(sources, offset, offset + limit);
});

app.use(router.routes());
app.use(router.allowedMethods());
app.use(koaStatic(`${__dirname}/../public`));

app.listen(port, () => console.log(`Listening on port ${port}`));
