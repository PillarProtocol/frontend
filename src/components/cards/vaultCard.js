import { Component } from 'react';
// import { CardContent, Grid, Card, Typography } from "@material-ui/core";
import { Typography } from '@material-ui/core';
import { cardContentStyles } from './cardContentStyles';
import FileCopyOutlinedIcon from '@material-ui/icons/FileCopyOutlined';
import classes from './vaultCard.module.scss';

import { DECIMAL, PILLAR_SYMBOL, LIQUIDATION_VALUE, DOLLAR as DOLLAR_SYMBOL, VAULT_FACTORY } from '../../config';

import { numberWithCommas, transformAddress as transform } from '../helpers';

import CircularProgress from '@material-ui/core/CircularProgress';
import { BigNumber as BN } from 'bignumber.js';

import { toBech32Address } from '@zilliqa-js/crypto';
class VaultCard extends Component {
    copyToClipboard(value) {
        navigator.clipboard.writeText(value);
    }
    render() {
        if (this.props.vaultData) {
            this.props.vaultData.liquidationValue = new BN(this.props.vaultData.collateralLockedInCents)
                .multipliedBy('100000000')
                .dividedBy(this.props.vaultData.liquidationRatio);
        }

        return (
            <div className={classes.parentDiv}>
                <div className={classes.outerContainer}>
                    <div className={classes.addressContainer}>
                        <div className={classes.addInnerContainer}>
                            <Typography style={cardContentStyles.title} component={'span'}>
                                {VAULT_FACTORY}
                            </Typography>
                            <Typography style={cardContentStyles.addressSecondryElement} component={'span'}>
                                {this.props.vaultData ? (
                                    transform(toBech32Address(this.props.vaultData.vaultFactory))
                                ) : (
                                    <div>
                                        <CircularProgress style={{ color: '#C9A46F' }} />
                                    </div>
                                )}

                                <div className={classes.leftSpacing}>
                                    <FileCopyOutlinedIcon
                                        fontSize={'inherit'}
                                        onClick={() => this.copyToClipboard(toBech32Address(this.props.vaultData.vaultFactory))}
                                    />
                                </div>
                            </Typography>
                        </div>

                        <div className={classes.addInnerContainer}>
                            <Typography style={cardContentStyles.title} component={'span'}>
                                {this.props.ownerAddress}
                            </Typography>
                            <Typography style={cardContentStyles.addressSecondryElement} component={'span'}>
                                {this.props.vaultData ? (
                                    transform(toBech32Address(this.props.vaultData.owner))
                                ) : (
                                    <div>
                                        <CircularProgress style={{ color: '#C9A46F' }} />
                                    </div>
                                )}
                                <div className={classes.leftSpacing}>
                                    <FileCopyOutlinedIcon
                                        style={cardContentStyles.leftPadding}
                                        fontSize={'inherit'}
                                        onClick={() => this.copyToClipboard(toBech32Address(this.props.vaultData.owner))}
                                    />
                                </div>
                            </Typography>
                        </div>
                    </div>

                    <div className={classes.restCards}>
                        <div>
                            <VaultSecondaryCardWithUSDValue
                                header={this.props.collateralLocked}
                                data={this.props.vaultData}
                                field={'collateralLocked'}
                                unit={this.props.vaultData ? this.props.vaultData.type : PILLAR_SYMBOL}
                                secondryField={'collateralLockedInCents'}
                                secondryUnit={DOLLAR_SYMBOL}
                            />
                        </div>

                        <div>
                            <VaultSecondaryCard
                                header={this.props.pillarBorrowed}
                                data={this.props.vaultData}
                                field={'pillarBorrowed'}
                                unit={PILLAR_SYMBOL}
                            />
                        </div>

                        <div>
                            <VaultSecondaryCard
                                header={this.props.totalDebt}
                                data={this.props.vaultData}
                                field={'totalDebt'}
                                unit={PILLAR_SYMBOL}
                            />
                        </div>
                        <div>
                            <VaultSecondaryCard
                                header={LIQUIDATION_VALUE}
                                data={this.props.vaultData}
                                field={'liquidationValue'}
                                unit={PILLAR_SYMBOL}
                            />
                        </div>

                        <div>
                            <VaultSecondaryCard
                                header={this.props.interestRate}
                                data={this.props.vaultData}
                                field={'interestRate'}
                                percent={true}
                            />
                        </div>

                        <div>
                            <VaultSecondaryCard
                                header={this.props.interestAccumulated}
                                data={this.props.vaultData}
                                field={'interestAccumulated'}
                                unit={PILLAR_SYMBOL}
                            />
                        </div>
                    </div>
                </div>
            </div>
            //       </CardContent>
            //     </Card>
            //   </Grid>
            //   <Grid item xs={6} md={3} lg={3} xl={3} style={cardStyle2}>
            //     <SecondryCard
            //       header={this.props.liquidationRatio}
            //       data={this.props.vaultData}
            //       field={"liquidationRatio"}
            //       percent={true}
            //     />
            //   </Grid>
            //   <Grid item xs={6} md={3} lg={3} xl={3} style={cardStyle2}>
            //     <SecondryCard
            //       header={this.props.interestRate}
            //       data={this.props.vaultData}
            //       field={"interestRate"}
            //       percent={true}
            //     />
            //   </Grid>
            //   <Grid item xs={6} md={3} lg={3} xl={3} style={cardStyle2}>
            //     <SecondryCard
            //       header={this.props.interestAccumulated}
            //       data={this.props.vaultData}
            //       field={"interestAccumulated"}
            //       unit={PILLAR_SYMBOL}
            //     />
            //   </Grid>
            // </Grid>
        );
    }
}

// class SecondryCard extends Component {
//   render() {
//     let element;
//     if (this.props.percent) {
//       element = (
//         <Typography style={cardContentStyles.secondryElement}>
//           {this.props.data ? (
//             numberWithCommas(this.props.data[this.props.field], 0) + " %"
//           ) : (
//             <div>
//               <CircularProgress style={{ color: "#C9A46F" }} />
//             </div>
//           )}
//         </Typography>
//       );
//     } else {
//       element = (
//         <Typography style={cardContentStyles.secondryElement}>
//           {this.props.data ? (
//             numberWithCommas(
//               this.props.data[this.props.field],
//               DECIMAL[this.props.unit]
//             )
//           ) : (
//             <div>
//               <CircularProgress style={{ color: "#C9A46F" }} />
//             </div>
//           )}
//         </Typography>
//       );
//     }
//     return (
//       <Card elevation={1}>
//         <CardContent>
//           <Typography style={cardContentStyles.title}>
//             {this.props.header}
//           </Typography>
//           {element}
//         </CardContent>
//       </Card>
//     );
//   }
// }

// let secondryElement;
//     if (this.props.secondryField) {
//       secondryElement = this.props.data
//         ? `${this.props.secondryUnit} ${numberWithCommas(
//             this.props.data[this.props.secondryField],
//             DECIMAL.TOTAL_COLLATERAL
//           )}`
//         : "Loading USD Value...";
//     }
class VaultSecondaryCardWithUSDValue extends Component {
    render() {
        let element = (
            <div className={classes.descrptionData}>
                {this.props.data ? (
                    <div>
                        {' '}
                        <div>{numberWithCommas(this.props.data[this.props.field], DECIMAL[this.props.unit]) + ' ' + this.props.unit}</div>
                        <div className={classes.secondaryText}>
                            {numberWithCommas(this.props.data[this.props.secondryField], DECIMAL.TOTAL_COLLATERAL) +
                                ' ' +
                                this.props.secondryUnit}
                        </div>
                    </div>
                ) : (
                    <div>
                        <CircularProgress style={{ color: '#C9A46F' }} />
                    </div>
                )}
            </div>
        );
        return (
            <div>
                <Typography style={cardContentStyles.title} component={'span'}>
                    {this.props.header}
                </Typography>
                {element}
            </div>
        );
    }
}
class VaultSecondaryCard extends Component {
    render() {
        let element;

        if (this.props.percent) {
            element = (
                <Typography style={cardContentStyles.secondryElement} component={'span'}>
                    {this.props.data ? (
                        numberWithCommas(this.props.data[this.props.field], this.props.decimal || 0) + ' %'
                    ) : (
                        <div>
                            <CircularProgress style={{ color: '#C9A46F' }} />
                        </div>
                    )}
                </Typography>
            );
        } else {
            element = (
                <Typography style={cardContentStyles.secondryElement} component={'span'}>
                    {this.props.data ? (
                        numberWithCommas(this.props.data[this.props.field], DECIMAL[this.props.unit]) + ' ' + this.props.unit
                    ) : (
                        <div>
                            <CircularProgress style={{ color: '#C9A46F' }} />
                        </div>
                    )}
                </Typography>
            );
        }
        return (
            <div>
                <Typography style={cardContentStyles.title} component={'span'}>
                    {this.props.header}
                </Typography>
                {element}
            </div>
        );
    }
}

export { VaultCard };
