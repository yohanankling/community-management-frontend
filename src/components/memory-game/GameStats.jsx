import React from 'react';
import { Card, Row, Col, Badge } from 'react-bootstrap';
import { Clock, Bullseye, Trophy, Percent } from 'react-bootstrap-icons';

const GameStats = ({ stats }) => {
    if (!stats) return null;

    return (
        <Card className="mb-3">
            <Card.Body className="py-2">
                <Row className="text-center">
                    <Col xs={3} className="border-end">
                        <div className="d-flex flex-column align-items-center">
                            <Clock className="text-primary mb-1" size={20} />
                            <small className="text-muted">Time</small>
                            <Badge bg="light" text="dark" className="fw-normal">
                                {stats.timeFormatted}
                            </Badge>
                        </div>
                    </Col>
                    
                    <Col xs={3} className="border-end">
                        <div className="d-flex flex-column align-items-center">
                            <Bullseye className="text-info mb-1" size={20} />
                            <small className="text-muted">Attempts</small>
                            <Badge bg="light" text="dark" className="fw-normal">
                                {stats.attempts}
                            </Badge>
                        </div>
                    </Col>
                    
                    <Col xs={3} className="border-end">
                        <div className="d-flex flex-column align-items-center">
                            <Trophy className="text-warning mb-1" size={20} />
                            <small className="text-muted">Matches</small>
                            <Badge bg="light" text="dark" className="fw-normal">
                                {stats.matches}/8
                            </Badge>
                        </div>
                    </Col>
                    
                    <Col xs={3}>
                        <div className="d-flex flex-column align-items-center">
                            <Percent className="text-success mb-1" size={20} />
                            <small className="text-muted">Accuracy</small>
                            <Badge bg="light" text="dark" className="fw-normal">
                                {stats.accuracy}
                            </Badge>
                        </div>
                    </Col>
                </Row>
            </Card.Body>
        </Card>
    );
};

export default GameStats;
