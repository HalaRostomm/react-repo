import React, { useState, useEffect } from 'react';
import { useParams } from "react-router-dom";
import adminService from '../service/adminService';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';
import { FaStar, FaCalendarCheck, FaCog, FaChartBar } from 'react-icons/fa';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { Container, Row, Col, Card, Badge } from 'react-bootstrap';

const localizer = momentLocalizer(moment);

const COLORS = {
  ACCENT: '#64B5F6',        
  BACKGROUND: '#D0D5CE',
  TEXT: '#000000',
  CARD: '#ffffff'
};

const SpDashAdmin = () => {
  const { spId } = useParams();
  const [isLoading, setIsLoading] = useState(true);
  const [ratings, setRatings] = useState([]);
  const [appointmentsServices, setAppointmentsServices] = useState([]);
  const [services, setServices] = useState(null);
  const [appointments, setAppointments] = useState([]);
  const [todayAppointments, setTodayAppointments] = useState([]);
  const [events, setEvents] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date());

  const parseData = (arr) =>
    arr.map(item => {
      const key = Object.keys(item)[0];
      return { label: key, value: item[key] };
    });

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const [servicesRes, ratingsRes, appointmentsRes, calendarRes] = await Promise.all([
          adminService.countServices(spId),
          adminService.getServiceRatings(spId),
          adminService.getAppointmentsPerService(spId),
          adminService.getTotalServiceAppointments(spId)
        ]);

        setServices(servicesRes.data);
        setRatings(parseData(ratingsRes.data));
        setAppointmentsServices(parseData(appointmentsRes.data));
        setAppointments(calendarRes.data);

        const eventsFormatted = calendarRes.data.map((a) => ({
          title: a.petName,
          start: new Date(a.selectedDate),
          end: new Date(a.selectedDate),
          appointmentId: a.appointmentId,
          petName: a.petName,
          startTime: a.startTime,
        }));

        setEvents(eventsFormatted);
        updateDate(new Date());
      } catch (err) {
        console.error(err);
      }
      setIsLoading(false);
    };

    fetchData();
  }, [spId]);

  const updateDate = (date) => {
    setSelectedDate(date);
    const sameDayAppointments = events.filter(
      (a) => new Date(a.start).toDateString() === date.toDateString()
    );
    setTodayAppointments(
      sameDayAppointments.sort((a, b) => a.startTime.localeCompare(b.startTime))
    );
  };

  const getMaxY = (data) => {
    const max = Math.max(...data.map(d => d.value));
    return Math.ceil(max / 5) * 5 || 5;
  };

  const CardWrapper = ({ title, icon, children }) => (
    <div style={{
      backgroundColor: COLORS.BACKGROUND,
      borderRadius: "12px",
      padding: "20px",
      margin: "15px 0",
      boxShadow: "0 4px 12px rgba(0,0,0,0.3)",
      color: COLORS.TEXT,
      flex: 1,
      minWidth: 280,
      fontFamily: "'Raleway', sans-serif"
    }}>
      <h5 style={{ marginBottom: 15 }}>
        {icon && <span style={{ marginRight: 8 }}>{icon}</span>}
        {title}
      </h5>
      {children}
    </div>
  );

  const ChartWrapper = ({ data }) => (
  <ResponsiveContainer width="100%" height={220}>
    <BarChart data={data}>
      <CartesianGrid strokeDasharray="3 3" stroke="#aaa" />
      <XAxis dataKey="label" stroke={COLORS.TEXT} />
      <YAxis domain={[0, getMaxY(data)]} stroke={COLORS.TEXT} />
      <Tooltip contentStyle={{ backgroundColor: '#fff', color: '#000' }} />
<Bar dataKey="value" fill={COLORS.ACCENT} radius={[6, 6, 0, 0]} />
    </BarChart>
  </ResponsiveContainer>
);

  if (isLoading) {
    return <div style={{ color: COLORS.TEXT, textAlign: 'center', marginTop: 60 }}>Loading...</div>;
  }

  return (
    <div style={{
      backgroundColor: COLORS.CARD,
      minHeight: '100vh',
      padding: 20,
      fontFamily: "'Raleway', sans-serif"
    }}>
      <h3 style={{
        color: COLORS.TEXT,
        textAlign: 'center',
        fontWeight: '600',
        marginBottom: 30
      }}>
        <FaChartBar style={{ marginRight: 10 }} />
        Service Provider Insights
      </h3>

      <div style={{
        display: 'flex',
        justifyContent: 'center',
        marginBottom: 30
      }}>
        <div style={{
          backgroundColor: COLORS.BACKGROUND,
          color: COLORS.TEXT,
          padding: 20,
          borderRadius: 12,
          fontSize: 22,
          fontWeight: 'bold',
          boxShadow: "0 4px 10px rgba(0,0,0,0.3)"
        }}>
          <FaCog style={{ marginRight: 10 }} />
          Total Services: {services}
        </div>
      </div>

      

      {/* Charts */}
    <Container fluid className="px-3">
  <Row className="g-3">
    <Col md={6}>
      <CardWrapper title="Services Ratings" icon={<FaStar />}>
        <ChartWrapper data={ratings} />
      </CardWrapper>
    </Col>
    <Col md={6}>
      <CardWrapper title="Appointments / Service" icon={<FaCalendarCheck />}>
        <ChartWrapper data={appointmentsServices} />
      </CardWrapper>
    </Col>
  </Row>
</Container>
    </div>
  );
};

export default SpDashAdmin;
