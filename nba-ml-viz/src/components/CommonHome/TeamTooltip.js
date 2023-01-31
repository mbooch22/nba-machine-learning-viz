import React from "react";
// TODO - enhance UI (Add team Logo)
const TeamTooltip = (props) => {
    const { left, top, fields, data } = props;
    return (
        <div>
            <div
                className="tooltip3"
                style={{
                    display: fields.length ? "block" : "none",
                    top: `${top}`,
                    left: `${left}`,
                    position: 'absolute',
                    backgroundColor: '#fff',
                    border: '1px solid gray',
                    boxShadow: '0 0 5px gray',
                    textAlign: 'center',
                }}>
                {data ? (
                    <div>
                        <span>{data.date}</span>
                        <br />
                        <span>Profit: ${data.totalProfit > 0 ? (
                            <span className="profit">{data.totalProfit}</span>
                        ) : (
                            <span className="profitLoss">{data.totalProfit}</span>
                        )
                        }
                        </span>
                        <br />
                    </div>
                ) :
                    null}
            </div>
        </div>

    )

}

export default TeamTooltip;