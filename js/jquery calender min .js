!(function (t, e, n, a) {
  'use strict';
  var s = 'simpleCalendar',
    i = {
      months: [
        'january',
        'february',
        'march',
        'april',
        'may',
        'june',
        'july',
        'august',
        'september',
        'october',
        'november',
        'december',
      ],
      days: [
        'sunday',
        'monday',
        'tuesday',
        'wednesday',
        'thursday',
        'friday',
        'saturday',
      ],
      displayYear: !0,
      fixedStartDay: !0,
      displayEvent: !0,
      disableEventDetails: !1,
      disableEmptyDetails: !1,
      events: [],
      onInit: function (t) {},
      onMonthChange: function (t, e) {},
      onDateSelect: function (t, e) {},
      onEventSelect: function () {},
      onEventCreate: function (t) {},
      onDayCreate: function (t, e, n, a) {},
    };
  function d(e, n) {
    (this.element = e),
      (this.settings = t.extend({}, i, n)),
      (this._defaults = i),
      (this._name = s),
      (this.currentDate = new Date()),
      this.init();
  }
  t.extend(d.prototype, {
    init: function () {
      var e = t(this.element),
        n = this.currentDate,
        a = t('<div class="calendar"></div>'),
        s = t(
          '<header><h2 class="month"></h2><a class="simple-calendar-btn btn-prev" href="#"></a><a class="simple-calendar-btn btn-next" href="#"></a></header>'
        );
      this.updateHeader(n, s),
        a.append(s),
        this.buildCalendar(n, a),
        e.append(a),
        this.bindEvents(),
        this.settings.onInit(this);
    },
    updateHeader: function (t, e) {
      var n = this.settings.months[t.getMonth()];
      (n += this.settings.displayYear
        ? ' <div class="year">' + t.getFullYear()
        : '</div>'),
        e.find('.month').html(n);
    },
    buildCalendar: function (e, n) {
      n.find('table').remove();
      var a = t('<table></table>'),
        s = t('<thead></thead>'),
        i = t('<tbody></tbody>'),
        d = e.getFullYear(),
        r = e.getMonth(),
        o = new Date(d, r, 1),
        h = new Date(d, r + 1, 0),
        l = o.getDay();
      if (!1 !== this.settings.fixedStartDay) {
        for (
          l = this.settings.fixedStartDay ? 1 : this.settings.fixedStartDay;
          o.getDay() !== l;

        )
          o.setDate(o.getDate() - 1);
        for (; h.getDay() !== (l + 7) % 7; ) h.setDate(h.getDate() + 1);
      }
      for (var c = l; c < l + 7; c++)
        s.append(
          t('<td>' + this.settings.days[c % 7].substring(0, 3) + '</td>')
        );
      for (var v = o; v <= h; v.setDate(v.getDate())) {
        var u = t('<tr></tr>');
        for (c = 0; c < 7; c++) {
          var g = t(
              '<td><div class="day" data-date="' +
                v.toISOString() +
                '">' +
                v.getDate() +
                '</div></td>'
            ),
            f = g.find('.day');
          v.toDateString() === new Date().toDateString() && f.addClass('today'),
            v.getMonth() != e.getMonth() && f.addClass('wrong-month');
          var D = this.getDateEvents(v);
          D.length && this.settings.displayEvent
            ? f.addClass(
                this.settings.disableEventDetails
                  ? 'has-event disabled'
                  : 'has-event'
              )
            : f.addClass(this.settings.disableEmptyDetails ? 'disabled' : ''),
            f.data('todayEvents', D),
            this.settings.onDayCreate(f, v.getDate(), r, d),
            u.append(g),
            v.setDate(v.getDate() + 1);
        }
        i.append(u);
      }
      a.append(s), a.append(i);
      var p = t(
        '<div class="event-container"><div class="close"></div><div class="event-wrapper"></div></div>'
      );
      n.append(a), n.append(p);
    },
    changeMonth: function (e) {
      this.currentDate.setMonth(this.currentDate.getMonth() + e, 1),
        this.buildCalendar(this.currentDate, t(this.element).find('.calendar')),
        this.updateHeader(
          this.currentDate,
          t(this.element).find('.calendar header')
        ),
        this.settings.onMonthChange(
          this.currentDate.getMonth(),
          this.currentDate.getFullYear()
        );
    },
    bindEvents: function () {
      var e = this;
      t(e.element).on('click', '.btn-prev', function (t) {
        e.changeMonth(-1), t.preventDefault();
      }),
        t(e.element).on('click', '.btn-next', function (t) {
          e.changeMonth(1), t.preventDefault();
        }),
        t(e.element).on('click', '.day', function (n) {
          var a = new Date(t(this).data('date')),
            s = e.getDateEvents(a);
          t(this).hasClass('disabled') ||
            (e.fillUp(n.pageX, n.pageY), e.displayEvents(s)),
            e.settings.onDateSelect(a, s);
        }),
        t(e.element).on('click', '.event-container .close', function (t) {
          e.empty(t.pageX, t.pageY);
        });
    },
    displayEvents: function (e) {
      var n = this,
        a = t(this.element).find('.event-wrapper');
      e.forEach(function (e) {
        var s = new Date(e.startDate),
          i = new Date(e.endDate),
          d = t(
            '<div class="event"> <div class="event-hour">' +
              s.getHours() +
              ':' +
              (s.getMinutes() < 10 ? '0' : '') +
              s.getMinutes() +
              '</div> <div class="event-date">' +
              n.formatDateEvent(s, i) +
              '</div> <div class="event-summary">' +
              e.summary +
              '</div></div>'
          );
        d.data('event', e),
          d.click(n.settings.onEventSelect),
          n.settings.onEventCreate(d),
          a.append(d);
      });
    },
    fillUp: function (e, n) {
      var a = t(this.element),
        s = a.offset(),
        i = t('<div class="filler" style=""></div>');
      i.css('left', e - s.left),
        i.css('top', n - s.top),
        a.find('.calendar').append(i),
        i.animate({ width: '300%', height: '300%' }, 500, function () {
          a.find('.event-container').show(), i.hide();
        });
    },
    empty: function (e, n) {
      var a = t(this.element),
        s = (a.offset(), a.find('.filler'));
      s.css('width', '300%'),
        s.css('height', '300%'),
        s.show(),
        a.find('.event-container').hide().find('.event').remove(),
        s.animate({ width: '0%', height: '0%' }, 500, function () {
          s.remove();
        });
    },
    getDateEvents: function (t) {
      var e = this;
      return e.settings.events.filter(function (n) {
        return e.isDayBetween(t, new Date(n.startDate), new Date(n.endDate));
      });
    },
    isDayBetween: function (t, e, n) {
      return (
        e.setHours(0, 0, 0),
        n.setHours(23, 59, 59, 999),
        t.setHours(12, 0, 0),
        e <= t && t <= n
      );
    },
    formatDateEvent: function (t, e) {
      var n = '';
      return (
        (n +=
          this.settings.days[t.getDay()] +
          ' - ' +
          t.getDate() +
          ' ' +
          this.settings.months[t.getMonth()].substring(0, 3)),
        e.getDate() !== t.getDate() &&
          (n +=
            ' to ' +
            e.getDate() +
            ' ' +
            this.settings.months[e.getMonth()].substring(0, 3)),
        n
      );
    },
  }),
    (t.fn[s] = function (e) {
      return this.each(function () {
        t.data(this, 'plugin_' + s) ||
          t.data(this, 'plugin_' + s, new d(this, e));
      });
    });
})(jQuery, window, document);
