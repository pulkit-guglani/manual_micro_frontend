"use client";

import { Button } from "ui";
import Image from "next/image";
import React from "react";
import { showCustomToast } from "ui";

const EmptyAssessment = () => {
  const handleButtonClick = () => {
    showCustomToast({
      title: "This feature is not available yet",
      subTitle: "We are still on it and will be available soon",
      type: "warning",
    });
  };
  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <Image
        src="/icons/no-assessment.svg"
        alt="Empty assessment"
        className="pb-4"
        width={114}
        height={80}
      />
      <p className="text-grayscale-900 text-h4-semibold pb-1">
        No assessments added yet
      </p>
      <p className="text-grayscale-700 text-label-regular pb-8 text-center">
        Create some industry ready assessments <br /> and share with your
        candidates
      </p>
      <div className="flex gap-2">
        <Button
          label="Browse Templates"
          variant="primary-fill"
          size="medium"
          onClick={handleButtonClick}
        />
        <Button
          label="Create Assessment"
          variant="primary-outline"
          size="medium"
          onClick={handleButtonClick}
        />
      </div>
    </div>
  );
};

export default EmptyAssessment;
