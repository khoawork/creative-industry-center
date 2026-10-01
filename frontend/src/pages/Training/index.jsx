import TrainingLayout from "../../components/Training/TrainingLayout";
import HeroSection from "../../components/Training/HeroSection";
import TrainingModels from "../../components/Training/TrainingModels";
import TrainingSection from "../../components/Training/TrainingSection";
import CertificationSection from "../../components/Training/CertificationSection";

import {
  trainingModels,
  trainings,
} from "../../data/trainingData";

export default function TrainingPage() {
  return (
    <TrainingLayout>

      <HeroSection />

      <TrainingModels models={trainingModels} />

      <TrainingSection trainings={trainings} />

      <CertificationSection />

    </TrainingLayout>
  );
}