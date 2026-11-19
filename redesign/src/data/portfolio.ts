import type { SketchId } from "@/lib/sketches";

export const profile = {
  scholar: "https://scholar.google.com/citations?user=KPchGe4AAAAJ&hl=en",
  github: "https://github.com/SANCHES-Pedro",
  linkedin: "https://www.linkedin.com/in/pedro-sanches-ppsg/en",
  orcid: "https://orcid.org/0000-0003-2435-3049"
};
const edinburgh = "https://vios.science/team/sanchez";
const thesis = "https://era.ed.ac.uk/items/2d13107e-dd89-4c16-a0bb-2e55dd81c93e/full";
export type SourceLink = readonly [label: string, href: string];

export interface Story {
  id: SketchId;
  title: string;
  tag: string;
  date: string;
  summary: string;
  image: string;
  links: readonly SourceLink[];
}

const work = new Map<SketchId, Story>();

function item(
  id: SketchId,
  title: string,
  tag: string,
  date: string,
  summary: string,
  image: string,
  links: readonly SourceLink[],
) {
  work.set(id, {id, title, tag, date, summary, image, links});
}
item("hike", "Hike Medical", "Applied AI · Orthotics", "2025–",
  "From a phone scan to a 3D model to a custom insole.",
  "A phone scans a foot outline, which resolves into a mesh and a layered orthotic insole.",
  [["Hike Clinical","https://www.hikemedical.com/products/clinical"],["Team scope","https://www.linkedin.com/posts/pedro-sanches-ppsg_we-just-raised-225m-ive-been-building-activity-7498027086687789056-6Byr"]]);
item("sinkove", "Sinkove", "Co-founder · Synthetic imaging", "2024–25",
  "Generate synthetic radiology images for research.",
  "A field of diffusion noise resolves into overlapping synthetic thorax scans.",
  [["Company","https://sinkove.com/about"],["AWS case study","https://builder.aws.com/content/31ru5acUWc2gMUTbn2ptlAYWeKa/building-the-future-of-medical-imaging-with-synthetic-data-and-distributed-training-lets-build-a-startup-s3e5"]]);
item("diffan", "DiffAN", "ICLR 2023 · Causal discovery", "2023",
  "Use diffusion models to infer the order of causes and effects.",
  "A cloud of observations becomes a directed graph of possible causal relationships.",
  [["Paper + poster","https://iclr.cc/virtual/2023/poster/11398"],["Code","https://github.com/SANCHES-Pedro/DiffAN"]]);
item("form", "FORM Geometry", "Project · Browser CAD", "",
  "Start from a sketch and build editable geometry in the browser.",
  "A planar profile extrudes into a solid in an isometric drawing.",
  [["Product","https://formgeometry.com/"]]);
item("radedit", "RadEdit", "ECCV 2024 · Microsoft Research", "2024",
  "Edit regions of an image to stress-test biomedical vision models.",
  "Two chest images sit side by side. A highlighted region identifies the localized edit.",
  [["Paper","https://doi.org/10.1007/978-3-031-73254-6_21"],["Microsoft Research","https://www.microsoft.com/en-us/research/blog/stress-testing-biomedical-vision-models-with-radedit-a-synthetic-data-approach-for-robust-model-deployment/"]]);
item("chex", "CheXGenBench", "TMLR 2026 · Synthetic radiographs", "2026",
  "Compare synthetic radiographs on fidelity, privacy, and utility.",
  "A chest scan connects to three comparison panels labeled fidelity, privacy, and utility.",
  [["Paper","https://www.research.ed.ac.uk/en/publications/chexgenbench-a-unified-benchmark-for-fidelity-privacy-and-utility/"],["Preprint + dataset","https://arxiv.org/abs/2505.10496"]]);
item("diffscm", "Diff-SCM", "CLeaR 2022 · Counterfactuals", "2022",
  "Ask how an image would change under a causal intervention.",
  "A change to one causal graph node propagates to the corresponding region of an image.",
  [["Paper","https://proceedings.mlr.press/v177/sanchez22a.html"],["Code","https://github.com/SANCHES-Pedro/Diff-SCM"]]);
item("healthy", "What Is Healthy?", "MICCAI workshop · Lesion localization", "2022",
  "Localize a lesion by comparing an image with a plausible healthy version.",
  "Two brain cross sections show an observed lesion and a hypothetical healthy counterpart.",
  [["Paper","https://doi.org/10.1007/978-3-031-18576-2_4"]]);
item("benchmark", "Counterfactual Benchmark", "NeurIPS 2024 · Evaluation", "2024",
  "Compare how image edits preserve the features that should stay the same.",
  "A source image branches into three edited variants for comparison.",
  [["Project + code","https://gulnazaki.github.io/counterfactual-benchmark/"]]);
item("monai", "MONAI Generative Models", "Open source · Medical imaging", "2023",
  "Generative models and tools for medical imaging.",
  "A modular stack connects different medical images to a shared generative toolbox.",
  [["Paper","https://arxiv.org/abs/2307.15208"],["Code","https://github.com/Project-MONAI/GenerativeModels"]]);
item("grounding", "Medical Phrase Grounding", "IEEE JBHI · Vision and language", "2025",
  "Connect a phrase in a report to the corresponding region of a chest image.",
  "A highlighted phrase in a report connects to a region of a chest scan.",
  [["Paper","https://doi.org/10.1109/JBHI.2024.3494246"],["Code","https://github.com/vios-s/ldm-phrase-grounding"]]);
item("uception", "Uception", "ISBI 2019 · Vessel segmentation", "2019",
  "Trace the brain’s blood vessels in a 3D scan.",
  "A set of image slices resolves into a branching vessel network.",
  [["Paper","https://ieeexplore.ieee.org/document/8759569"],["Code","https://github.com/SANCHES-Pedro/Segmentation_3D_DeepLearning"]]);
item("temporal", "Causal Structure in Time Series", "TMLR 2025 · Causal discovery", "2025",
  "Find causal order in signals measured over time.",
  "Three time series and lagged connections expose a possible order.",
  [["Paper","https://www.research.ed.ac.uk/en/publications/causal-ordering-for-structure-learning-from-time-series/"]]);
item("phd", "University of Edinburgh", "PhD · Causal deep learning", "2024",
  "Causal reasoning, discovery, and representation learning for images.",
  "A thesis page links a directed graph with layers of digital images.",
  [["Dissertation","https://era.ed.ac.uk/items/2d13107e-dd89-4c16-a0bb-2e55dd81c93e/full"],["VIOS Lab",edinburgh]]);
item("microsoft", "Microsoft Research", "Research internship · Health Futures", "2023",
  "Worked on multimodal diffusion for medical imaging, including RadEdit.",
  "An image and its edit mask enter a shared diffusion pipeline.",
  [["RadEdit paper","https://arxiv.org/abs/2312.12865"],["Microsoft Research","https://www.microsoft.com/en-us/research/blog/stress-testing-biomedical-vision-models-with-radedit-a-synthetic-data-approach-for-robust-model-deployment/"]]);
item("canon", "Canon Medical Research", "Research engineering · Imaging", "2020–21",
  "Worked on CT lesion segmentation and 2D/3D image registration.",
  "A stack of CT slices aligns and reveals a highlighted region.",
  [["Canon research","https://research.eu.medical.canon/publications/our-publications/"],["VIOS profile",edinburgh]]);
item("samsung", "Samsung Research Brazil", "Research internship · Video", "2019",
  "Worked on probabilistic video compression.",
  "Two video frames become a sparse matrix of motion and residual information.",
  [["CVPR Workshops paper","https://openaccess.thecvf.com/content_CVPRW_2020/html/w7/da_Silva_Joint_Motion_and_Residual_Information_Latent_Representation_for_P-Frame_Coding_CVPRW_2020_paper.html"]]);
item("ge", "GE Healthcare", "Research internship · CT", "2019",
  "Registered CT images to compensate for breathing motion.",
  "Two lung outlines from different breathing phases move into alignment.",
  [["VIOS profile",edinburgh]]);
item("icube", "ICube Laboratory", "Research internship · Angiography", "2018",
  "Worked on segmenting blood vessels in MR angiography.",
  "Thin vessel branches are traced on a stack of MR angiography slices.",
  [["ISBI paper","https://ieeexplore.ieee.org/document/8759569"],["Preprint","https://arxiv.org/abs/1812.01752"]]);
item("strasbourg", "University of Strasbourg", "MSc · Biomedical engineering", "2019",
  "Studied medical imaging, pose estimation, and inverse problems.",
  "A jointed pose is reconstructed from several projection rays.",
  [["Education profile",edinburgh]]);
item("dual", "Strasbourg × Brasília", "Dual engineering degrees", "2019–20",
  "Biomedical engineering in France and electrical engineering in Brazil.",
  "An electrical breadboard and a biomedical signal share a connected circuit.",
  [["Education profile",edinburgh]]);
item("causal", "Causal Machine Learning", "Research interest", "",
  "Understand what changes when we intervene.",
  "An intervention on one node changes its descendants in a causal graph.",
  [["Healthcare and precision medicine","https://doi.org/10.1098/rsos.220638"],["Dissertation",thesis]]);
item("generative", "Generative Models", "Research interest", "",
  "Turn noise into structured images and controllable variations.",
  "Three panels show a progression from random noise to a coherent image.",
  [["MONAI paper","https://arxiv.org/abs/2307.15208"],["CheXGenBench","https://arxiv.org/abs/2505.10496"]]);
item("imaging", "Medical Imaging", "Research interest", "",
  "Use images to locate and characterize structures.",
  "A scanner cross section and a highlighted contour illustrate image segmentation.",
  [["Lesion localization paper","https://doi.org/10.1007/978-3-031-18576-2_4"],["Uception code","https://github.com/SANCHES-Pedro/Segmentation_3D_DeepLearning"]]);
item("geometry", "Computational Geometry", "Project interest", "",
  "Turn a design idea into a parametric 3D model.",
  "Control points on a sketch move to change the profile of a curved solid.",
  [["FORM Geometry","https://formgeometry.com/"],["Hike Clinical","https://www.hikemedical.com/products/clinical"]]);
item("dream", "DREAM at MICCAI", "Teaching · Tutorial", "2021",
  "Co-organized and taught a tutorial on disentangled representations.",
  "Two image layers separate to reveal independent factors.",
  [["Tutorial + slides","https://vios.science/tutorials/dream2021"],["Paper","https://www.sciencedirect.com/science/article/pii/S1361841522001633"]]);
item("tutorial", "Diffusion at MICCAI", "Teaching · Tutorial", "2023",
  "Organized and presented a tutorial on diffusion in medical imaging.",
  "A blackboard sketch walks through noising, denoising, and a medical image.",
  [["Tutorial + materials","https://vios.science/tutorials/diffusion-2023"]]);
item("award", "Peter Grant Award", "University of Edinburgh · Best conference paper", "2023",
  "School of Engineering award for the ICLR paper on causal discovery.",
  "A graph drawn on a paper page is marked with an award ribbon.",
  [["Award announcement","https://www.linkedin.com/posts/pedro-sanches-ppsg_very-honoured-to-receive-the-peter-grant-activity-7110298767009959937-DXpc"],["ICLR paper","https://iclr.cc/virtual/2023/poster/11398"]]);
item("patent1", "Causal Ordering Invention", "Published US patent application", "2024",
  "Determine causal relationships through variable ordering.",
  "A patent drawing shows a sequence of variables arranged into a graph.",
  [["US20240111488A1","https://patents.google.com/patent/US20240111488A1/en"]]);
item("patent2", "Image Segmentation Invention", "Published US patent application", "2024",
  "Segment medical images with different forms of supervision.",
  "A patent drawing shows image patches aligning into a segmented structure.",
  [["US20240355098A1","https://patents.google.com/patent/US20240355098A1/en"]]);

item("kite", "Kitesurfing", "Sport", "", "",
  "A kitesurfer rides across waves while a kite moves with the wind.",
  []);
item("cycling", "Cycling", "Sport", "", "",
  "A bicycle moves along a mountain road, with its wheels and pedals turning.",
  []);
item("snowboarding", "Snowboarding", "Sport", "", "",
  "A snowboarder carves down a snowy slope with mountains in the background.",
  []);

export const groups = {
  research: ["diffan","chex","temporal","radedit","diffscm","healthy","benchmark","grounding","monai"],
  startups: ["sinkove","form","hike"],
  cv: ["hike","sinkove","phd","microsoft","canon","dual","strasbourg","samsung","ge","icube"],
  sports: ["kite","cycling","snowboarding"],
} as const satisfies Record<string, readonly SketchId[]>;

export type PortfolioGroup = keyof typeof groups;

export function getStory(id: SketchId): Story {
  const story = work.get(id);
  if (!story) throw new Error("Unknown portfolio story: " + id);
  return story;
}
