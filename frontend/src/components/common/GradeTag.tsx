import React from 'react';
import { QualityGrade } from '../../types/index.js';

interface GradeTagProps {
  grade?: QualityGrade | 'low' | 'medium' | 'high' | string;
}

export function GradeTag({ grade = 'HIGH' }: GradeTagProps) {
  const normGrade = String(grade).toUpperCase();

  let gradeClass = 'high';
  let label = 'High Grade';

  if (normGrade === 'LOW') {
    gradeClass = 'low';
    label = 'Low Grade';
  } else if (normGrade === 'MEDIUM') {
    gradeClass = 'medium';
    label = 'Medium Grade';
  } else {
    gradeClass = 'high';
    label = 'High Grade';
  }

  return (
    <span className={`grade-tag ${gradeClass}`}>
      {label}
    </span>
  );
}
