import type { Question, Level } from "@/types/quiz";
import type { SubjectConfig } from "@/types/subject";
import { shuffleArray } from "@/lib/shuffle";

import rawModule2 from "@/data/cloud-architecture/module-2.json";
import rawModule3 from "@/data/cloud-architecture/module-3.json";
import rawModule4 from "@/data/cloud-architecture/module-4.json";
import rawModule5 from "@/data/cloud-architecture/module-5.json";
import rawModule6 from "@/data/cloud-architecture/module-6.json";
import rawModule7 from "@/data/cloud-architecture/module-7.json";
import rawModule8 from "@/data/cloud-architecture/module-8.json";
import rawModule10 from "@/data/cloud-architecture/module-10.json";
import rawModule11 from "@/data/cloud-architecture/module-11.json";
import rawModule12 from "@/data/cloud-architecture/module-12.json";
import rawModule13 from "@/data/cloud-architecture/module-13.json";
import rawModule14 from "@/data/cloud-architecture/module-14.json";

const module2Questions = (rawModule2 as Question[]).map((q) => ({ ...q, id: q.id + 2000 }));
const module3Questions = (rawModule3 as Question[]).map((q) => ({ ...q, id: q.id + 2100 }));
const module4Questions = (rawModule4 as Question[]).map((q) => ({ ...q, id: q.id + 2200 }));
const module5Questions = (rawModule5 as Question[]).map((q) => ({ ...q, id: q.id + 2300 }));
const module6Questions = (rawModule6 as Question[]).map((q) => ({ ...q, id: q.id + 2400 }));
const module7Questions = (rawModule7 as Question[]).map((q) => ({ ...q, id: q.id + 2500 }));
const module8Questions = (rawModule8 as Question[]).map((q) => ({ ...q, id: q.id + 2600 }));
const module10Questions = (rawModule10 as Question[]).map((q) => ({ ...q, id: q.id + 2700 }));
const module11Questions = (rawModule11 as Question[]).map((q) => ({ ...q, id: q.id + 2800 }));
const module12Questions = (rawModule12 as Question[]).map((q) => ({ ...q, id: q.id + 2900 }));
const module13Questions = (rawModule13 as Question[]).map((q) => ({ ...q, id: q.id + 3000 }));
const module14Questions = (rawModule14 as Question[]).map((q) => ({ ...q, id: q.id + 3100 }));

const allQuestions = [
  ...module2Questions, ...module3Questions, ...module4Questions,
  ...module5Questions, ...module6Questions, ...module7Questions,
  ...module8Questions, ...module10Questions, ...module11Questions,
  ...module12Questions, ...module13Questions, ...module14Questions,
];

const questions: Record<string, Question[]> = {
  "cloud-module-2": module2Questions,
  "cloud-module-3": module3Questions,
  "cloud-module-4": module4Questions,
  "cloud-module-5": module5Questions,
  "cloud-module-6": module6Questions,
  "cloud-module-7": module7Questions,
  "cloud-module-8": module8Questions,
  "cloud-module-10": module10Questions,
  "cloud-module-11": module11Questions,
  "cloud-module-12": module12Questions,
  "cloud-module-13": module13Questions,
  "cloud-module-14": module14Questions,
};

function buildQuestions(level: Level, shuffle: boolean): Question[] {
  const maybeShuffleArray = <T,>(arr: T[]) => shuffle ? shuffleArray(arr) : arr;

  if (questions[level]) {
    return maybeShuffleArray([...questions[level]]);
  }
  return [];
}

export const cloudArchitectureSubject: SubjectConfig = {
  id: "cloud-architecture",
  name: "Cloud Architecture",
  code: "AWS Academy",
  description: "120 questions across 12 modules",
  icon: "☁️",
  color: "bg-orange-600",
  lectures: [
    { id: "M2", key: "Module2-IntroducingCloudArchitecting", title: "Introducing Cloud Architecting", color: "bg-orange-500" },
    { id: "M3", key: "Module3-SecuringAccess", title: "Securing Access", color: "bg-orange-600" },
    { id: "M4", key: "Module4-AddingStorageLayerWithAmazonS3", title: "Adding Storage Layer with Amazon S3", color: "bg-amber-500" },
    { id: "M5", key: "Module5-AddingAComputerLayerUsingAmazonEC2", title: "Adding a Computer Layer using Amazon EC2", color: "bg-yellow-500" },
    { id: "M6", key: "Module6-AddingADatabaseLayer", title: "Adding a Database Layer", color: "bg-lime-500" },
    { id: "M7", key: "Module7-CreatingANetworkingEnvironment", title: "Creating a Networking Environment", color: "bg-green-500" },
    { id: "M8", key: "Module8-ConnectingNetworks", title: "Connecting Networks", color: "bg-teal-500" },
    { id: "M10", key: "Module10-ImplementingMonitoringElasticity", title: "Implementing Monitoring, Elasticity", color: "bg-cyan-500" },
    { id: "M11", key: "Module11-AutomatingYourArchitecture", title: "Automating Your Architecture", color: "bg-blue-500" },
    { id: "M12", key: "Module12-CachingContent", title: "Caching Content", color: "bg-indigo-500" },
    { id: "M13", key: "Module13-BuildingDecoupledArchitectures", title: "Building Decoupled Architectures", color: "bg-violet-500" },
    { id: "M14", key: "Module14-BuildingServerlessArchitecture", title: "Building Serverless Architecture", color: "bg-purple-500" },
  ],
  lectureNames: {
    "Module2-IntroducingCloudArchitecting": "Module 2 · Introducing Cloud Architecting",
    "Module3-SecuringAccess": "Module 3 · Securing Access",
    "Module4-AddingStorageLayerWithAmazonS3": "Module 4 · Adding Storage Layer with Amazon S3",
    "Module5-AddingAComputerLayerUsingAmazonEC2": "Module 5 · Adding a Computer Layer using Amazon EC2",
    "Module6-AddingADatabaseLayer": "Module 6 · Adding a Database Layer",
    "Module7-CreatingANetworkingEnvironment": "Module 7 · Creating a Networking Environment",
    "Module8-ConnectingNetworks": "Module 8 · Connecting Networks",
    "Module10-ImplementingMonitoringElasticity": "Module 10 · Implementing Monitoring, Elasticity",
    "Module11-AutomatingYourArchitecture": "Module 11 · Automating Your Architecture",
    "Module12-CachingContent": "Module 12 · Caching Content",
    "Module13-BuildingDecoupledArchitectures": "Module 13 · Building Decoupled Architectures",
    "Module14-BuildingServerlessArchitecture": "Module 14 · Building Serverless Architecture",
  },
  lectureOrder: [
    "Module2-IntroducingCloudArchitecting",
    "Module3-SecuringAccess",
    "Module4-AddingStorageLayerWithAmazonS3",
    "Module5-AddingAComputerLayerUsingAmazonEC2",
    "Module6-AddingADatabaseLayer",
    "Module7-CreatingANetworkingEnvironment",
    "Module8-ConnectingNetworks",
    "Module10-ImplementingMonitoringElasticity",
    "Module11-AutomatingYourArchitecture",
    "Module12-CachingContent",
    "Module13-BuildingDecoupledArchitectures",
    "Module14-BuildingServerlessArchitecture",
  ],
  levelGroups: [
    {
      groupLabel: "Modules",
      levels: [
        { level: "cloud-module-2" as Level, label: "Module 2", desc: "Introducing Cloud Architecting", color: "bg-orange-500 hover:bg-orange-600" },
        { level: "cloud-module-3" as Level, label: "Module 3", desc: "Securing Access", color: "bg-orange-500 hover:bg-orange-600" },
        { level: "cloud-module-4" as Level, label: "Module 4", desc: "Adding Storage Layer with Amazon S3", color: "bg-orange-500 hover:bg-orange-600" },
        { level: "cloud-module-5" as Level, label: "Module 5", desc: "Adding a Computer Layer using Amazon EC2", color: "bg-orange-500 hover:bg-orange-600" },
        { level: "cloud-module-6" as Level, label: "Module 6", desc: "Adding a Database Layer", color: "bg-orange-500 hover:bg-orange-600" },
        { level: "cloud-module-7" as Level, label: "Module 7", desc: "Creating a Networking Environment", color: "bg-orange-500 hover:bg-orange-600" },
        { level: "cloud-module-8" as Level, label: "Module 8", desc: "Connecting Networks", color: "bg-orange-500 hover:bg-orange-600" },
        { level: "cloud-module-10" as Level, label: "Module 10", desc: "Implementing Monitoring, Elasticity", color: "bg-orange-500 hover:bg-orange-600" },
        { level: "cloud-module-11" as Level, label: "Module 11", desc: "Automating Your Architecture", color: "bg-orange-500 hover:bg-orange-600" },
        { level: "cloud-module-12" as Level, label: "Module 12", desc: "Caching Content", color: "bg-orange-500 hover:bg-orange-600" },
        { level: "cloud-module-13" as Level, label: "Module 13", desc: "Building Decoupled Architectures", color: "bg-orange-500 hover:bg-orange-600" },
        { level: "cloud-module-14" as Level, label: "Module 14", desc: "Building Serverless Architecture", color: "bg-orange-500 hover:bg-orange-600" },
      ],
    },
  ],
  questions,
  allQuestions,
  buildQuestions,
};
