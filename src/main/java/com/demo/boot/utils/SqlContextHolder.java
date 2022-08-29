package com.demo.boot.utils;

import java.util.HashMap;
import java.util.Map;

public class SqlContextHolder {
	public static final ThreadLocal<Boolean> THREAD_LOCAL_SQLYN = ThreadLocal.withInitial(() -> false);
	public static final ThreadLocal<Map<String,Object>> THREAD_LOCAL_SQL = ThreadLocal.withInitial(() -> new HashMap<String,Object>());
}
