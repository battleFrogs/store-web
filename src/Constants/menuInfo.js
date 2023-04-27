
import { Link } from 'react-router-dom';
import { PieChartOutlined } from '@ant-design/icons';
import history from '../Config/history';


export const menu = [
    {
        key: "1",
        icon: <PieChartOutlined />,
        path: "/page/home",
        labelName: "首页内容",
        identity: ["student", "teacher", "super"]
    },
    {
        key: "2",
        icon: <PieChartOutlined />,
        identity: ["student", "teacher", "super"],
        children: [{
            key: "3",
            path: "/user/student",
            labelName: "学生列表",
            identity: ["teacher", "super"]
        },
        {
            key: "4",
            path: "/user/operate",
            labelName: "用户信息",
            identity: ["student", "teacher", "super"]
        },
        {
            key: "5",
            path: "/user/classes",
            labelName: "班级信息",
            identity: ["teacher", "super"]
        },
        {
            key: "6",
            path: "/user/teacher",
            labelName: "教师信息",
            identity: ["super"]
        },

        ],
        labelName: '操作内容',

    },
    {
        key: "7",
        icon: <PieChartOutlined />,
        labelName: "商品",
        identity: ["student", "teacher", "super"],
        children: [
            {
                key: "8",
                path: "/goods/edit",
                labelName: "商品创建",
                identity: ["teacher", "super"]
            },
            {
                key: "9",
                path: "/goods/list",
                labelName: "商品列表",
                identity: ["teacher", "super"]
            }
        ]
    },
]

/**
 * 
 * @param {*} param 导航栏对象数组 
 * @returns antd指定的格式对象数组
 */
export const result = (param, identity) => {

    let resultArray = []
    for (let index = 0; index < param.length; index++) {
        const res = param[index];
        if (res.children) {
            let label = res.labelName
            if (res.path) {
                label = <Link to={res.path}> {res.labelName}</Link>
            }
            if (res.identity.includes(identity)) {
                resultArray.push({
                    key: res.key,
                    icon: res.icon,
                    label,
                    children: result(res.children, identity)
                })
            }
        } else {
            if (res.identity.includes(identity)) {
                resultArray.push({
                    key: res.key,
                    icon: res.icon,
                    label: <Link to={res.path}> {res.labelName}</Link>,
                })
            }

        }
    }


    return resultArray
}

/**
 * 
 * @param {*} menu  导航栏对象数组
 * @param {*} pathName  需要匹配的路径字符串
 * @returns  路径对应的key的数组
 */
export const getKeyByPathName = (menu, pathName) => {

    let identity = sessionStorage.getItem("identity")

    for (let index = 0; index < menu.length; index++) {
        const value = menu[index];
        if (value.children) {
            const valueResult = getKeyByPathName(value.children, pathName)
            if (valueResult.length > 0) {
                return valueResult
            }
        }
        if (value.path === pathName) {
            if (!value.identity.includes(identity)) {
                history.push("/noAllow/not")
            }
            return Array.from(value.key)
        }
    }
    return []
}

export const getLabelNameByPathName = (menu, keyName) => {

    let result = []
    for (let index = 0; index < menu.length; index++) {
        const value = menu[index];
        if (value.children) {
            const valueResult = getLabelNameByPathName(value.children, keyName)
            if (valueResult.length > 0) {
                result.push(value.labelName)
                result.push(valueResult)
            }
        }
        if (value.key == keyName) {
            result.push(value.labelName)
            return result
        }
    }

    return result
}




/**
 * 
 * @returns 获取打开的key
 */
export const getOpenKeys = () => {
    let result = []
    menu.forEach((item) => {
        if (item.children) {
            result.push(item.key)
        }
    })
    return result
}


