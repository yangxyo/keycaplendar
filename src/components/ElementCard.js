import React from 'react';
import { GridCell } from '@rmwc/grid';
import { Typography } from '@rmwc/typography';
import { Card, CardActions, CardActionButtons, CardActionButton, CardMedia } from '@rmwc/card';
import { Icon } from '@rmwc/icon';

import './ElementCard.scss';

export class ElementCard extends React.Component {
    constructor(props) {
        super(props);
        this.state = { expanded: false };
    }
    toggleExpand = () => {
        this.setState(prevState => ({ expanded: !prevState.expanded }))
    }
    render() {
        return (
            <GridCell className='card-container' desktop={4} tablet={4} phone={4}>
                <Card className={this.state.expanded ? "expanded" : ""}>
                    <div className="main-block">
                        <CardMedia sixteenByNine style={{ backgroundImage: 'url(' + this.props.image + ')' }} />
                        <div className="text-row" onClick={this.toggleExpand}>
                            <div className="text-container">
                                <div className="title">
                                    <div className="time-indicator">
                                        <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24"><path d="M0 0h24v24H0V0z" fill="none" /><path d="M12.07 6.01c-3.87 0-7 3.13-7 7s3.13 7 7 7 7-3.13 7-7-3.13-7-7-7zm1 8h-2v-6h2v6z" opacity=".3" /><path d="M9.07 1.01h6v2h-6zm2 7h2v6h-2zm8.03-.62l1.42-1.42c-.43-.51-.9-.99-1.41-1.41l-1.42 1.42C16.14 4.74 14.19 4 12.07 4c-4.97 0-9 4.03-9 9s4.02 9 9 9 9-4.03 9-9c0-2.11-.74-4.07-1.97-5.61zm-7.03 12.62c-3.87 0-7-3.13-7-7s3.13-7 7-7 7 3.13 7 7-3.13 7-7 7z" /></svg>
                                    </div>
                                    <Typography use="headline5" tag="h2" theme="textPrimaryOnBackground">{this.props.title}</Typography>
                                </div>
                                <Typography use="subtitle2" tag="p" theme="textSecondaryOnBackground">{this.props.subtitle}</Typography>
                            </div>
                            <div className="expand-icon-container">
                                <Icon className="expand-icon" icon="expand_more" />
                            </div>
                        </div>
                    </div>
                    <div className="expand-actions">
                        <CardActions>
                            <CardActionButtons>
                                <a href={this.props.geekhack} target="_blank" rel="noopener noreferrer"><CardActionButton>Geekhack</CardActionButton></a>
                                <a href={this.props.store} target="_blank" rel="noopener noreferrer"><CardActionButton>Store</CardActionButton></a>
                            </CardActionButtons>
                        </CardActions>
                    </div>
                </Card>
            </GridCell>
        )
    }
}

export default ElementCard;