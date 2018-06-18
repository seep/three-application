import resolve from 'rollup-plugin-node-resolve';

export default {

  input: 'main.js',

  output: {
    file: 'bundle.js',
    format: 'iife'
  },

  watch: {
    include: 'main.js'
  },

  plugins: [ resolve() ],

}
