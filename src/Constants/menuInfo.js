
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
        },
        {
            key: "4",
            path: "/user/operate",
            labelName: "操作者信息",
        },
        {
            key: "5",
            path: "/user/classes",
            labelName: "班级信息",
        },
        {
            key: "6",
            path: "/user/teacher",
            labelName: "教师信息",
        },

        ],
        labelName: '用户操作',

    },
]

/**
 * 
 * @param {*} param 导航栏对象数组 
 * @returns antd指定的格式对象数组
 */
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

/**
 * 
 * @param {*} menu  导航栏对象数组
 * @param {*} pathName  需要匹配的路径字符串
 * @returns  路径对应的key的数组
 */
export const getKeyByPathName = (menu, pathName) => {
    for (let index = 0; index < menu.length; index++) {
        const value = menu[index];
        if (value.children) {
            const valueResult = getKeyByPathName(value.children, pathName)
            if (valueResult) {
                return valueResult
            }
        }
        if (value.path === pathName) {
            return Array.from(value.key)
        }
    }
    return []
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


