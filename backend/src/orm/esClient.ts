import {Client} from "@elastic/elasticsearch";

const esClient = new Client({ node: 'http://elasticsearch:9200' });
export default esClient