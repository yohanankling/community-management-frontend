import React from 'react';
import { Card, Row, Col, Badge } from 'react-bootstrap';
import { Clock, Bullseye, Trophy, Percent } from 'react-bootstrap-icons';

// GameStats component displays real-time statistics for a memory game.
// It receives a 'stats' object as a prop, which contains the current game metrics.
const GameStats = ({ stats }) => {
    // If no stats object is provided, the component renders nothing.
    if (!stats) return null;

    return (
        // A Bootstrap Card component to contain the game statistics.
        // It has a bottom margin for spacing.
        <Card className="mb-3">
            {/* The body of the card, with vertical padding adjusted. */}
            <Card.Body className="py-2">
                {/* A Bootstrap Row to lay out the statistics horizontally.
                    Text is centered within the row. */}
                <Row className="text-center">
                    {/* Column for "Time" statistic. */}
                    {/* It takes 3 units of the grid width on extra small screens and has a right border. */}
                    <Col xs={3} className="border-end">
                        <div className="d-flex flex-column align-items-center">
                            <Clock className="text-primary mb-1" size={20} /> {/* Clock icon with primary color. */}
                            <small className="text-muted">Time</small> {/* Label for the statistic. */}
                            <Badge bg="light" text="dark" className="fw-normal">
                                {stats.timeFormatted} {/* Displays the formatted time. */}
                            </Badge>
                        </div>
                    </Col>

                    {/* Column for "Attempts" statistic. */}
                    <Col xs={3} className="border-end">
                        <div className="d-flex flex-column align-items-center">
                            <Bullseye className="text-info mb-1" size={20} /> {/* Bullseye icon with info color. */}
                            <small className="text-muted">Attempts</small>
                            <Badge bg="light" text="dark" className="fw-normal">
                                {stats.attempts} {/* Displays the number of attempts. */}
                            </Badge>
                        </div>
                    </Col>

                    {/* Column for "Matches" statistic. */}
                    <Col xs={3} className="border-end">
                        <div className="d-flex flex-column align-items-center">
                            <Trophy className="text-warning mb-1" size={20} /> {/* Trophy icon with warning color. */}
                            <small className="text-muted">Matches</small>
                            <Badge bg="light" text="dark" className="fw-normal">
                                {stats.matches}/8 {/* Displays current matches out of 8 total. */}
                            </Badge>
                        </div>
                    </Col>

                    {/* Column for "Accuracy" statistic. */}
                    {/* This is the last column in the row, so it doesn't have a right border. */}
                    <Col xs={3}>
                        <div className="d-flex flex-column align-items-center">
                            <Percent className="text-success mb-1" size={20} /> {/* Percent icon with success color. */}
                            <small className="text-muted">Accuracy</small>
                            <Badge bg="light" text="dark" className="fw-normal">
                                {stats.accuracy} {/* Displays the accuracy percentage. */}
                            </Badge>
                        </div>
                    </Col>
                </Row>
            </Card.Body>
        </Card>
    );
};

export default GameStats;