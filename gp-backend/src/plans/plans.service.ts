import { Injectable, BadRequestException } from '@nestjs/common';
import * as XLSX from 'xlsx';

@Injectable()
export class PlansService {
  async handleExcelUpload(file: any) {
    if (!file) {
      throw new BadRequestException('No file uploaded');
    }

    if (!file.buffer) {
      throw new BadRequestException('Uploaded file has no buffer');
    }

    console.log('------ Excel Upload ------');
    console.log('Original name:', file.originalname);
    console.log('MIME type:', file.mimetype);
    console.log('Size (bytes):', file.size);
    console.log('--------------------------');

    const excelFile = XLSX.read(file.buffer, { type: 'buffer' });

    const sheetName = excelFile.SheetNames[0];
    const sheet = excelFile.Sheets[sheetName];

    if (!sheet) {
      throw new BadRequestException('No sheet found in Excel file');
    }

    const rows = XLSX.utils.sheet_to_json(sheet, {
      defval: null,
    });

    console.log('Parsed rows count:', rows.length);
    if (rows.length > 0) {
      console.log('First row example:', rows[0]);
    }

    return {
      message: 'Excel parsed successfully',
      sheetName,
      rowsCount: rows.length,
      rows,
    };
  }

  generateMockPlan(body: any) {
    // إذا بدك تستعملي rows لاحقاً:
    // const rows = body?.rows ?? [];

    return {
      planId: 218,
      title: 'G3-B | Mathematics | Week 0 (Nov 10 - Nov 15)',
      subject: 'Mathematics',
      grade: 'Third',
      section: 'B',
      week: { from: '2025-11-10', to: '2025-11-15' },
      metrics: {
        planProgressPct: 0,
        tasksCompletedToday: 0,
        tasksTotalToday: 0,
        atRiskStudentsCount: 4,
      },
      skillFocus: [
        { skillCode: 'M3-FRA-01', skillTitle: 'Simplifying Fractions' },
        { skillCode: 'M3-FRA-02', skillTitle: 'Mixed Numbers' },
      ],
      schedule: {
        days: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday'],
        rows: [
          {
            rowLabel: 'Skill Focus (Top)',
            cells: [
              {
                day: 'Sunday',
                task: {
                  taskId: 'T1',
                  title: 'Simplifying Fractions',
                  type: 'exercise',
                  durationMin: 15,
                  details:
                    'Practice simplifying using GCF (e.g., 6/12 → 1/2).',
                  status: 'Planned',
                },
              },
              { day: 'Monday', task: null },
              {
                day: 'Tuesday',
                task: {
                  taskId: 'T2',
                  title: 'Group Practice',
                  type: 'activity',
                  durationMin: 15,
                  details:
                    'Students simplify 10 fractions in pairs; compare answers.',
                  status: 'Planned',
                },
              },
              { day: 'Wednesday', task: null },
              {
                day: 'Thursday',
                task: {
                  taskId: 'T3',
                  title: 'Review & Mini Quiz',
                  type: 'quiz',
                  durationMin: 30,
                  details: '5 questions: simplify + equivalent fractions.',
                  status: 'Planned',
                },
              },
            ],
          },
          {
            rowLabel: 'Unit Practice (Bottom)',
            cells: [
              {
                day: 'Sunday',
                task: {
                  taskId: 'T4',
                  title: 'Mixed Numbers',
                  type: 'exercise',
                  durationMin: 15,
                  details:
                    'Convert: 9/4 → 2 1/4, 11/3 → 3 2/3.',
                  status: 'Planned',
                },
              },
              {
                day: 'Monday',
                task: {
                  taskId: 'T5',
                  title: 'Improper Conversion',
                  type: 'exercise',
                  durationMin: 15,
                  details:
                    'Convert mixed → improper and check by multiplication.',
                  status: 'Planned',
                },
              },
              {
                day: 'Tuesday',
                task: {
                  taskId: 'T6',
                  title: 'Review & Mini Quiz',
                  type: 'quiz',
                  durationMin: 30,
                  details:
                    '3 conversions + 2 number-line questions.',
                  status: 'Planned',
                },
              },
              { day: 'Wednesday', task: null },
              { day: 'Thursday', task: null },
            ],
          },
        ],
      },
    };
  }
}
