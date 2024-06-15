/* Magic Mirror
 * Module: MMM-euro2024
 *
 * By 0m4r
 *
 */

Module.register('MMM-euro2024', {
  fixtures: [],
  loaded: false,
  nextUpdate: [],

  defaults: {
    updateInterval: 60 * 60 * 1000,
    competitionId: "2018",
    token: "",
  },

  start: function () {
    Log.info('Starting module ' + this.name);
    Log.info('with config: ' + JSON.stringify(this.config));
    this.sendSocketNotification(this.name + 'CONFIG', this.config);
  },

  stop: function () {
    Log.info('Stopping module ' + this.name);
  },

  resume: function () {
    Log.info('Resuming module ' + this.name);
    Log.debug('with config: ' + JSON.stringify(this.config));
    this.sendSocketNotification(this.name + 'CONFIG', this.config);
  },

  getDom: function () {
    const wrapper = document.createElement('div');
    wrapper.className = 'MMM-euro2024';

    if (!this.loaded) {
      wrapper.innerHTML = 'Loading...';
      return wrapper;
    }

    const buildTD = (value = '', classes = [], colspan = 1) => {
      const td = document.createElement('td');
      let classNames = classes
      if (!Array.isArray(classes)) {
        classNames = [classes]
      }
      td.classList.add(...classNames)
      td.innerHTML = value;
      td.setAttribute('colspan', colspan);
      return td;
    }

    const buildTDForFlag = (value, classes) => {
      const td = buildTD('', classes)
      const img = document.createElement('img')
      img.src = value
      img.style.width = '20px'
      img.style.height = '20px'
      td.appendChild(img)
      return td;
    }

    const buildTH = (value) => {
      const th = document.createElement('th');
      th.innerHTML = value;
      return th;
    }

    const table = document.createElement('table');
    table.classList.add('xsmall', 'MMM-euro2024-table');
    wrapper.appendChild(table);

    var dateCount = 0;
    this.fixtures.forEach(f => {
      if (dateCount < 3) {
        dateCount++;
        const tr = document.createElement('tr');
        tr.appendChild(buildTD(new Date(f.date).toLocaleDateString(), 'MMM-euro2024-date', 7));
        table.appendChild(tr)

        f.games.forEach(m => {
          const tr1 = document.createElement('tr');
          const time = new Date(m.utcDate).toLocaleTimeString()
          const group = m.group
          tr1.appendChild(buildTD(time + " " + group, [], 7));
          tr1.classList.add('MMM-euro2024-' + m.status, 'MMM-euro2024-time-group')
          table.appendChild(tr1)

          const tr = document.createElement('tr');
          tr.appendChild(buildTD(m.homeTeam.name, 'MMM-euro2024-homeTeam'));
          tr.appendChild(buildTDForFlag(m.homeTeam.flag, 'MMM-euro2024-flag'));
          tr.appendChild(buildTD(m.score.fullTime.home, 'MMM-euro2024-score'));
          tr.appendChild(buildTD('-'));
          tr.appendChild(buildTD(m.score.fullTime.away, 'MMM-euro2024-score'));
          tr.appendChild(buildTDForFlag(m.awayTeam.flag, 'MMM-euro2024-flag'));
          tr.appendChild(buildTD(m.awayTeam.name, 'MMM-euro2024-awayTeam'));
          table.appendChild(tr)

          tr.classList.add('MMM-euro2024-' + m.status)
        });
      }
    });


    return wrapper;
  },

  socketNotificationReceived: function (notification, payload) {
    Log.info(this.name, 'socketNotificationReceived', notification);
    Log.info(this.name, 'socketNotificationReceived', payload);

    if (notification === this.name + 'VERSION_RESULTS') {
      this.loaded = true;
      this.version = {};
      if (payload && Object.keys(payload).length > 0) {
        this.version = payload;
      }
      this.updateDom();
    }

    if (notification === this.name + 'FIXTURES') {
      this.loaded = true;
      this.fixtures = payload;
      this.updateDom();
    }

    if (notification === this.name + 'NEXT_UPDATE') {
      this.loaded = true,
        this.nextUpdate = payload;
      this.updateDom();
    }
  },

  getStyles: function () {
    return ['MMM-euro2024.css'];
  },
});
