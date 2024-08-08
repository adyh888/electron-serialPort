/**
 * 检测版本不能低于最低版本要求
 */
export function compareVersions(versionA: string, versionB: string): boolean {
  const partsA = versionA.split('.')
  const partsB = versionB.split('.')

  // 确保两个版本号有相同数量的部分，通过填充较小的版本号以0
  const maxLength = Math.max(partsA.length, partsB.length)
  partsA.length = maxLength
  partsB.length = maxLength

  for (let i = 0; i < maxLength; i++) {
    const numA = parseInt(partsA[i] || '0', 10)
    const numB = parseInt(partsB[i] || '0', 10)

    if (numA > numB) {
      return true
    } else if (numA < numB) {
      return false
    }
  }

  // 如果所有部分都相等，则认为它们相等
  return true
}
