# style-to-json
Takes an element's style and converts it to JSON that's compatible with [css-layout](https://github.com/facebook/css-layout)

## Use

```bash
npm install --save style-to-json
```

```javascript
var styleToJSON = require("style-to-json");

// #myElement { width: 10px; flex: 1; display: flex; margin-top: 10px;}
var element = document.getElementById("myElement");

var style = styleToJSON(element);

// {width: 10, flex: 1, display: "flex", marginTop: 10}
```

## Caveats:
Not all CSS will be parsed out. Only attributes [supported](https://github.com/facebook/css-layout#supported-attributes) by css-layout are taken into consideration.

As well, units are lost during parsing, so `10px` is the same as `10em` or `10%`;

Values for attributes should only contain one value. For example, `margin` will ignore everything after the first value. So `margin: 10px 5px 15px;` will result in `{margin: 10}`. Same applies anywhere else that multiple values are possible in vanilla CSS.

## Testing
- clone the repo
- `npm install`
- `npm run test`

More thorough tests are welcome. Currently there's just one test that does everything in one go.
