import { defineStore } from 'pinia';

export const useScoreStore = defineStore('score', {
  state: () => ({
    events: [
      { id: 1, name: '100公尺', group: '男子' },
      { id: 2, name: '100公尺', group: '女子' },
      { id: 3, name: '200公尺', group: '男子' },
      { id: 4, name: '200公尺', group: '女子' },
      { id: 5, name: '400公尺', group: '男子' },
      { id: 6, name: '400公尺', group: '女子' },
      { id: 7, name: '800公尺', group: '男子' },
      { id: 8, name: '800公尺', group: '女子' },
      { id: 9, name: '1600公尺', group: '男子' },
      { id: 10, name: '1600公尺', group: '女子' },
      { id: 11, name: '跳遠', group: '男子' },
      { id: 12, name: '跳遠', group: '女子' },
      { id: 13, name: '跳高', group: '男子' },
      { id: 14, name: '跳高', group: '女子' },
      { id: 15, name: '鉛球', group: '男子' },
      { id: 16, name: '鉛球', group: '女子' },
      { id: 17, name: '400公尺接力', group: '混合' },
      { id: 18, name: '大隊接力', group: '混合' },
      { id: 19, name: '趣味競賽', group: '混合' }
    ],
    selectedEvent: null,
    selectedType: null,
    selectedGrade: null,
    scores: [],
  }),
  actions: {
    async generateScores(eventId, type, grade) {
      const response = await fetch(`http://localhost:8080/score/individualPerformances/item/${eventId}`);
      let data = await response.json();

      if (type) {
        data = data.filter(item => item.preMatch === type);
      }

      let classRange;
      if (grade === '高一') {
        classRange = ['101', '102', '103', '104', '105', '106', '107', '108', '109', '110', '111', '112', '113', '114', '115', '116'];
      } else if (grade === '高二') {
        classRange = ['201', '202', '203', '204', '205', '206', '207', '208', '209', '210', '211', '212', '213', '214', '215', '216'];
      } else if (grade === '高三') {
        classRange = ['301', '302', '303', '304', '305', '306', '307', '308', '309', '310', '311', '312', '313', '314', '315', '316'];
      }

      data = data.filter(item => classRange.includes(item.classes));

      this.scores = data.map((item, index) => ({
        academicYear: item.academicYear,
        id: item.id,
        historicalPerformance: item.historicalPerformance,
        itemId: item.itemId,
        courseItem: item.courseItem,
        preMatch: item.preMatch,
        classes: item.classes,
        studentName: item.studentName || '',
        projectPerformance: item.projectPerformance || '',
        breakRecord: this.isBreakRecord(item),
        rank: item.ranking || '',
        projectScore: null  // 不先載入 projectScore
      }));
    },
    async generateScoresFromHistorical(eventId, type, grade, year) {
      const response = await fetch(`http://localhost:8080/score/historicalPerformances/item/${eventId}`);
      let data = await response.json();

      if (type) {
        data = data.filter(item => item.preMatch === type);
      }

      if (year) {
        data = data.filter(item => item.academicYear === year);
      }

      let classRange;
      if (grade === '高一') {
        classRange = ['101', '102', '103', '104', '105', '106', '107', '108', '109', '110', '111', '112', '113', '114', '115', '116'];
      } else if (grade === '高二') {
        classRange = ['201', '202', '203', '204', '205', '206', '207', '208', '209', '210', '211', '212', '213', '214', '215', '216'];
      } else if (grade === '高三') {
        classRange = ['301', '302', '303', '304', '305', '306', '307', '308', '309', '310', '311', '312', '313', '314', '315', '316'];
      }

      data = data.filter(item => classRange.includes(item.classes));

      this.scores = data.map((item, index) => ({
        academicYear: item.academicYear,
        id: item.id,
        historicalPerformance: item.historicalPerformance,
        itemId: item.itemId,
        courseItem: item.courseItem,
        preMatch: item.preMatch,
        classes: item.classes,
        studentName: item.studentName || '',
        projectPerformance: item.projectPerformance || '',
        breakRecord: this.isBreakRecord(item),
        rank: item.ranking || '',
        projectScore: null  // 不先載入 projectScore
      }));
    },
    setScores(newScores) {
      this.scores = newScores;
    },
    updateScore(id, itemId, field, value) {
      const score = this.scores.find(score => score.id === id && score.itemId === itemId);
      if (score) {
        score[field] = value;
        if (field === 'projectPerformance') {
          score.breakRecord = this.isBreakRecord(score);
        }
      }
    },
    isBreakRecord(score) {
      const historical = parseFloat(score.historicalPerformance.replace(/[^\d.]/g, ''));
      const current = parseFloat(score.projectPerformance.replace(/[^\d.]/g, ''));
      const isDistanceEvent = [11, 12, 13, 14, 15, 16].includes(score.itemId);

      if (isDistanceEvent) {
        return current > historical;
      } else {
        return current < historical;
      }
    },
    updateRanks() {
      const timeToSeconds = (time) => {
        let totalSeconds = 0;
        if (time.includes('m')) {
          const [minPart, secPart] = time.split('m');
          totalSeconds += parseFloat(minPart) * 60;
          totalSeconds += parseFloat(secPart.replace('s', ''));
        } else {
          totalSeconds += parseFloat(time.replace('s', ''));
        }
        return totalSeconds;
      };

      const distanceToMeters = (distance) => {
        return parseFloat(distance.replace('m', ''));
      };

      const isDistanceEvent = (event) => {
        return ['跳高', '跳遠', '鉛球'].includes(event.name);
      };

      const currentEvent = this.events.find(event => event.id === this.selectedEvent);

      const sortedScores = [...this.scores].sort((a, b) => {
        if (isDistanceEvent(currentEvent)) {
          return distanceToMeters(b.projectPerformance) - distanceToMeters(a.projectPerformance);
        } else {
          return timeToSeconds(a.projectPerformance) - timeToSeconds(b.projectPerformance);
        }
      });

      sortedScores.forEach((score, index) => {
        const originalScore = this.scores.find(s => s.id === score.id);
        if (originalScore) {
          originalScore.rank = index + 1;
        }
      });
    },
    generateProjectScores() {
      this.scores = this.scores.map(score => {
        let projectScore = 0;
        const rank = parseInt(score.rank, 10);
        const itemId = parseInt(score.itemId, 10);

        if (rank <= 3) {
          if (itemId >= 1 && itemId <= 16) {
            if (rank === 1) {
              projectScore = 5;
            } else if (rank === 2) {
              projectScore = 3;
            } else if (rank === 3) {
              projectScore = 1;
            }
          } else if (itemId >= 17 && itemId <= 19) {
            if (rank === 1) {
              projectScore = 10;
            } else if (rank === 2) {
              projectScore = 7;
            } else if (rank === 3) {
              projectScore = 5;
            }
          }
        }
        return { ...score, projectScore: projectScore };
      });
      this.scores = [...this.scores];
    },
    generatePreMatchScores() {
      this.scores = this.scores.map(score => {
        if (score.preMatch === '預賽') {
          score.projectScore = 0;
        }
        return score;
      });
    },
    async submitScores() {
      const data = this.scores.map(score => ({
        academicYear: score.academicYear,
        id: score.id,
        historicalPerformance: score.historicalPerformance,
        itemId: score.itemId,
        courseItem: score.courseItem,
        preMatch: score.preMatch,
        classes: score.classes,
        studentName: score.studentName || '',
        projectPerformance: score.projectPerformance,
        breakRecord: score.breakRecord,
        ranking: score.rank,
        projectScore: score.projectScore,
        totalScore: score.totalScore
      }));

      const response = await fetch('http://localhost:8080/score/individualPerformances/batch', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        console.log('成績已成功送出');
      } else {
        console.error('送出成績時發生錯誤');
      }
    },
    calculateTotalScores() {
      this.scores.forEach(score => {
        score.totalScore = this.scores.reduce((sum, s) => sum + (s.projectScore || 0), 0);
      });
    },
    async submitTotalScores() {
      const data = this.scores.map(score => ({
        academicYear: score.academicYear,
        id: score.id,
        historicalPerformance: score.historicalPerformance,
        itemId: score.itemId,
        courseItem: score.courseItem,
        preMatch: score.preMatch,
        classes: score.classes,
        studentName: score.studentName || '',
        projectPerformance: score.projectPerformance,
        breakRecord: score.breakRecord,
        ranking: score.rank,
        projectScore: score.projectScore,
        totalScore: score.totalScore
      }));

      const response = await fetch('http://localhost:8080/score/classPerformances/batch', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        console.log('總積分已成功送出');
      } else {
        console.error('送出總積分時發生錯誤');
      }
    },
  },
});

