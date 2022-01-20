import dynamic from 'next/dynamic';

const Graphviz = dynamic(() => import('graphviz-react'), { ssr: false });

const graphContent = `digraph {
  // Base Styling
  rankdir="TB";
  splines=true;
  overlap=false;
  nodesep="0.2";
  ranksep="0.2";
  label="Hook Types \n \n";
  labelloc="t";
  fontname="Lato";
  node [ shape="rectangle" color="white" style="filled" fontname="Consolas" margin=0.1 ]
  pad="0.1,0.2"

  // legend & labels
  init [label="" fillcolor="gold"]
  initLabel [shape="plaintext" label="Init"]

  config [label="" fillcolor="dodgerblue"]
  configLabel [shape="plaintext" label="Configuration"]

  logParser [label="" fillcolor="darkseagreen"]
  logParserLabel [shape="plaintext" label="Log Parser"]

  changelog [label="" fillcolor="orange"]
  changelogLabel [shape="plaintext" label="Changelog"]

  releaseLifecycle [label="" fillcolor="tomato"]
  releaseLifecycleLabel [label="Release Lifecycle"]

  // stacking nodes
  init -> config -> logParser -> changelog -> releaseLifecycle [style=invis]

  // for each item in list, placing label on it's side
  {rank="same" init -> initLabel [style=invis]}
  {rank="same" config -> configLabel [style=invis]}
  {rank="same" logParser -> logParserLabel [style=invis]}
  {rank="same" changelog -> changelogLabel [style=invis]}
  {rank="same" releaseLifecycle -> releaseLifecycleLabel [style=invis]}
}`;

/**
 * Builds Graph structure
 *
 * @returns Graph
 */
export const Hooks = () => {
  return <div className='graphViz'>
    <Graphviz dot={graphContent} />
  </div>;
}
