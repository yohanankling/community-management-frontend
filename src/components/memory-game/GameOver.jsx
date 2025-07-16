import React from 'react';
import { Modal, Button, Row, Col, Badge } from 'react-bootstrap';
import { Trophy, Clock, Bullseye, Percent, Star } from 'react-bootstrap-icons';

const GameOver = ({ show, stats, onNewGame, onClose }) => {
    if (!stats || !stats.isComplete) return null;

    const getPerformanceMessage = () => {
        const accuracy = parseFloat(stats.accuracy);
        const timeInSeconds = stats.timeInSeconds;
        
        if (accuracy >= 90 && timeInSeconds <= 120) {
            return { message: "Outstanding! Perfect memory!", icon: "🏆", variant: "success" };
        } else if (accuracy >= 80 && timeInSeconds <= 180) {
            return { message: "Excellent performance!", icon: "🌟", variant: "primary" };
        } else if (accuracy >= 70) {
            return { message: "Good job! Keep practicing!", icon: "👍", variant: "info" };
        } else {
            return { message: "Nice try! You'll do better next time!", icon: "💪", variant: "warning" };
        }
    };

    const performance = getPerformanceMessage();

    return (
        <Modal show={show} onHide={onClose} centered>
            <Modal.Header closeButton>
                <Modal.Title className="d-flex align-items-center">
                    <Trophy className="text-warning me-2" />
                    Game Complete!
                </Modal.Title>
            </Modal.Header>
            
            <Modal.Body className="text-center">
                <div className="mb-4">
                    <div className="display-1 mb-2">{performance.icon}</div>
                    <h4 className={`text-${performance.variant}`}>
                        {performance.message}
                    </h4>
                </div>

                <Row className="mb-4">
                    <Col xs={6} className="mb-3">
                        <div className="d-flex flex-column align-items-center">
                            <Clock className="text-primary mb-2" size={24} />
                            <small className="text-muted">Total Time</small>
                            <Badge bg="primary" className="fs-6">
                                {stats.timeFormatted}
                            </Badge>
                        </div>
                    </Col>
                    
                    <Col xs={6} className="mb-3">
                        <div className="d-flex flex-column align-items-center">
                            <Bullseye className="text-info mb-2" size={24} />
                            <small className="text-muted">Attempts</small>
                            <Badge bg="info" className="fs-6">
                                {stats.attempts}
                            </Badge>
                        </div>
                    </Col>
                    
                    <Col xs={6}>
                        <div className="d-flex flex-column align-items-center">
                            <Percent className="text-success mb-2" size={24} />
                            <small className="text-muted">Accuracy</small>
                            <Badge bg="success" className="fs-6">
                                {stats.accuracy}
                            </Badge>
                        </div>
                    </Col>
                    
                    <Col xs={6}>
                        <div className="d-flex flex-column align-items-center">
                            <Star className="text-warning mb-2" size={24} />
                            <small className="text-muted">Score</small>
                            <Badge bg="warning" className="fs-6">
                                {Math.max(1000 - (stats.attempts * 10) - (stats.timeInSeconds * 2), 100)}
                            </Badge>
                        </div>
                    </Col>
                </Row>
            </Modal.Body>
            
            <Modal.Footer className="justify-content-center">
                <Button variant="primary" onClick={onNewGame} className="me-2">
                    <Trophy className="me-2" />
                    Play Again
                </Button>
                <Button variant="outline-secondary" onClick={onClose}>
                    Close
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default GameOver;
