
import { Link } from 'react-router-dom';
import { PieChartOutlined } from '@ant-design/icons';


export const menu = [
    {
        key: "1",
        icon: <PieChartOutlined />,
        path: "/page/home",
        labelName: "首页内容"

    },
    {
        key: "2",
        icon: <PieChartOutlined />,
        children: [{
            key: "3",
            path: "/user/student",
            labelName: "学生列表",
        }],
        labelName: '用户操作',

    },
]

export const result = (param) => {

    let resultArray = []
    for (let index = 0; index < param.length; index++) {
        const res = param[index];
        if (res.children) {
            let label = res.labelName
            if (res.path) {
                label = <Link to={res.path}> {res.labelName}</Link>
            }
            resultArray.push({
                key: res.key,
                icon: res.icon,
                label,
                children: result(res.children)
            })
        } else {
            resultArray.push({
                key: res.key,
                icon: res.icon,
                label: <Link to={res.path}> {res.labelName}</Link>,
            })
        }
    }


    return resultArray
}


