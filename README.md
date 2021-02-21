# MUNlite Frontend

## Project setup

```shell
npm install
```

### Compiles and hot-reloads for development

```shell
npm run serve && ngrok http 8098 && vue-devtools
```

### Compiles and minifies for production

```shell
npm run build
```

### Run your end-to-end tests

```shell
npm run test:e2e
```

### Lints and fixes files

```shell
npm run lint
```

## Components

### Context Menu

#### Usage

```html
<div
  v-for="(data, index) in Array"
  @contextmenu.prevent="showC($event, data, index)"
  v-touch:touchhold.prevent="showCon(data, index)"
/>
```

```js
showC(event, data, index) { // For pointer
      if (!this.showInput) {
        this.$store.dispatch('context', [
          [data.title, data.id, index], // 1st param name, id, & index
          { Edit: true, Delete: false }, // 2nd param all actions; false if disabled
          [event.clientX, event.clientY], // 3nd param clientX & clientY of event
        ]);
      }
    },
    showCon(data, index) { // For touch
      return (event) => {
        if (!this.showInput) {
          this.$store.dispatch('context', [
            [data.title, data._id, index], // 1st param name, id, & index
            { Edit: true, Delete: false }, // 2nd param all actions; false if disabled
            [event.touches[0].clientX, event.touches[0].clientY], // 3nd param clientX & clientY of event
          ]);
        }
      };
    },
```

```js
$root.on('context', (...args) => console.log(...args)); // [action, name, id, index]
```

### Add Conference

#### Usage

```js
import AddConference from '@/components/AddConference/index.vue';
```

```html
<add-conference
  :conf="conferenceData"
  @exit="exitMethod"
  @update="updateConferencesData"
  v-click-outside="config"
/>
```

#### Click Outside Config

```js
config: {
  handler: method,
  events: ['click'],
},
```

#### Props

| Props | Type | Description | Required |
|-|-|-|-|
| `conf` | `Object` | If provided with conference object, input boxes will be pre-filled with the object data. | No |

### Search & Filter

#### Usage

```js
import Search from '@/components/Search/index.vue';
```

```html
<Search
  :items="array"
  :sortFunc="sortMethod"
  :sortTypes="['type']"
  :filterFunc="filterMethod"
  :filterTypes="['type', ['typeGroup', 'typeGroup', 'typeGroup']]"
  @sortedData="(data) => {
    console.log(...data)
  }"
>
```

#### Methods Examples

```js
sortMethod(items, type, dir) { // accepts 3 paramaters
  if (type === 'name') { // check type name
    items.sort((a, b) => {
      let compare;
      switch (dir) { // determine sort direction
        case 'up':
          compare = a.title < b.title;
          break;
        case 'down':
          compare = a.title > b.title;
          break;
        default:
          compare = a.title < b.title;
      }
      switch (compare) { // actual comparison
        case true:
          return -1;
        case false:
          return 1;
        default:
          return 0;
      }
    });
  }
  return items;
},
```

```js
filterMethod(items, tags, search) { // accepts 3 parameters
  let list = items;
  if (search !== '') { // filter for text search
    list = list.filter(
      (item) => item.title.toLowerCase().indexOf(search.toLowerCase()) > -1,
    );
  }
  if (tags.includes('Filter')) { // filter for tags
    list = items.filter((item) => item === 'filter');
  }
  return list;
},
```

#### Props

| Props | Type | Description | Required |
|-|-|-|-|
| `items` | `Array` | List of items to search & filter from. | Yes |
| `sortTypes` | `Array` | List of types of sorting. Each sort comes with `up` and `down` direction | Yes |
| `sortFunc` | `Function` | Function for sorting with 3 paramters `(items, tags, direction)`. | Yes |
| `filterTypes` | `Array` | List of types of filters. Can be grouped within an array to act as `either/or`. Otherwise, acts like `and`. | Yes |
| `filterFunc` | `Function` | Function for filtering with 3 paramters `(items, tags, search)`. | Yes |

### Autocomplete

#### Usage

```js
import Autocomplete from '@/components/Autocomplete/index.vue';
```

```html
<Autocomplete
  :items="countryList"
  @onchangeCountry="(country) => {
    console.log(country)
  }"
  placeholder="Placeholder String"
/>
```

#### Props

| Props | Type | Description | Required |
|-|-|-|-|
| `items` | `Array` | List of country to auto-complete from. | Yes |
| `placeholder` | `String` | Input placeholder string. | Yes |

### Confirmation

#### Usage

```js
import Confirmation from '@/components/confirmation/index.vue';
```

```html
<Confirmation
  content="Content String"
  :action="confirmMethod"
  :id="id of conference/delegate"
  button="String on Button"
  :negative="true"
  v-click-outside="config"
  @exit="exitMethod"
/>
```

#### Click Outside Config

```js
config: {
  handler: method,
  events: ['click'],
},
```

#### Props

| Prop | Type | Description | Required |
|-|-|-|-|
| `content` | `String` | Content String on modal. | Yes |
| `id` | `String` | ID of Conference/Delegate | No |
| `action` | `Function` | Method on confirmation. | Yes |
| `button` | `String` | String on button. | Yes |
| `negative` | `Boolean` | If true, button will be red. If not defined, button will be white. | No |

### Card Stacks

#### Usage

```js
import CardStack from '@/components/CardStack/index.vue';
```

```html
<CardStack 
  :delegates="[{delegatesData}]"
  :active="0"
  :isActive="true"
  :actions="{
    'View Notes': true,
    'Delete': false,
  }"
  display="5"
  desc="presence"
  progress="45"
  color="#FFF"
  @move="moveMethod"
/>
```

#### Delegates Object

```js
delegatesData: {
  country: 'Name',
  _id: 'id',
  time_start: 90, /* Optional */
  time_left: 85,  /* Optional */
  yield: 'Other Delegate ID or String', /* Optional */
}
```

#### move method

```js
moveMethod(index) {
  // limit min-max values to only the total delegates length
  const i = Math.min(Math.max(parseInt(index, 10), 0), delegatesData.length);
  display = i;
},
```

#### Props

|  Prop  | Default  | Type |                                          Description                                           | Required? |
|:-------: |:-------: |:----: |------------------------------------------------------------ |:---------: |
| `delegates` | `null` | `Array` | The object array of delegates. | Yes |
| `active` | `0` | `Number`  | Index number of `delegates` marking which delegate is on the timer. | No |
| `isActive` | `false` | `Boolean`  | Indicate a timer is running | No |
| `actions` | `{}` | `Object`  | Object of actions for context menu; set key to false for disabled. | Yes |
| `display` | `0` | `Number`  | Index number of `delegates` to show in the card stacks. | Yes |
|`desc` | `''` | `String` | Set custom description. Use value `presence` to dynamically update with the country's presence. | No |
| `progress` | `0` | `Number`/`String` | Set custom card progress. Use value `presence` to dynamically update with the country's presence. | No |
| `color` | `#5F78FF` | `String` | Set custom progress color. | No |
