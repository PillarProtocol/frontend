import React from 'react';
import Logo from '../../logo.svg';
import classes from './style.module.scss';
import { Link } from '@material-ui/core';
class Footer extends React.Component {
    render() {
        return (
            <div className={classes.footer}>
                <div className={classes.leftSideContent}>
                    <img src={Logo} alt="logo" />
                    <div className={classes.rightsReserved}>All rights reserved by Pillar Protocol</div>
                </div>
                <div className={classes.rightSideContent}>
                    <div className={classes.textSpacing}>
                        <Link
                            target="_blank"
                            rel="noopener"
                            href="https://pillarprotocol.com/"
                            color="inherit"
                            style={{ textDecoration: 'none', color: 'inherit' }}
                        >
                            How it works
                        </Link>
                    </div>
                    <div className={classes.textSpacing}>
                        <Link
                            target="_blank"
                            rel="noopener"
                            href="https://t.me/PillarProtocol"
                            color="inherit"
                            style={{ textDecoration: 'none', color: 'inherit' }}
                        >
                            Telegram
                        </Link>
                    </div>
                    <div className={classes.textSpacing}>
                        <Link
                            target="_blank"
                            rel="noopener"
                            href="https://twitter.com/DevPillar"
                            color="inherit"
                            style={{ textDecoration: 'none', color: 'inherit' }}
                        >
                            Twitter
                        </Link>
                    </div>
                    <div className={classes.textSpacing}>
                        <Link
                            target="_blank"
                            rel="noopener"
                            href="https://discord.gg/8nWEyRBq"
                            color="inherit"
                            style={{ textDecoration: 'none', color: 'inherit' }}
                        >
                            Discord
                        </Link>
                    </div>
                </div>
            </div>
        );
    }
}

export default Footer;
